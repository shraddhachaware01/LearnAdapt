
import { useState, useEffect, useRef } from 'react';

import questions from './engine/question.js';

import {
  calculateScores,
  getPercentage,
  getLevel,
  generateRoadmap,
} from './engine/scoring.js';

import './Quiz.css';

// Backend API URLs
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001';

const API_URL = `${API_BASE_URL}/api/quiz-results`;
const AI_API_URL = `${API_BASE_URL}/api/analyze-performance`;

const conceptNames = {
  'promise-basics': 'Promise Basics',
  'promise-states': 'Promise States',
  'then-catch': 'Then & Catch',
  'async-await': 'Async / Await',
  'error-handling': 'Error Handling',
};

function Quiz({ onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState('');

  // Stores the MongoDB document returned after saving
  const savedResultRef = useRef(null);

  // Prevents duplicate processing
  const processingRef = useRef(false);

  const question = questions[currentQuestion];

  const quizFinished =
    currentQuestion === questions.length - 1 &&
    selectedAnswer !== '';

  const userAnswers = questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    return answer ? answer.selectedAnswer : undefined;
  });

  const conceptScores = calculateScores(questions, userAnswers);
  const roadmap = generateRoadmap(conceptScores);

  const overallPercentage = getPercentage(score, questions.length);

  const strongConcepts = Object.values(conceptScores).filter(
    (result) =>
      getLevel(getPercentage(result.correct, result.total)) === 'strong'
  ).length;

  const weakConcepts = Object.values(conceptScores).filter(
    (result) =>
      getLevel(getPercentage(result.correct, result.total)) === 'weak'
  ).length;

  const learningLevel =
    getLevel(overallPercentage).charAt(0).toUpperCase() +
    getLevel(overallPercentage).slice(1);

  // STEP 1: Save quiz result to MongoDB and return saved document
  async function saveQuizResult() {
    // Reuse existing MongoDB document if already saved
    if (savedResultRef.current) {
      return savedResultRef.current;
    }

    setSaveStatus('saving');
    setSaveError('');

    const result = {
      score,
      totalQuestions: questions.length,
      percentage: overallPercentage,

      conceptScores: Object.fromEntries(
        Object.entries(conceptScores).map(([concept, data]) => [
          concept,
          getPercentage(data.correct, data.total),
        ])
      ),

      learningLevel,

      weakConcepts: Object.entries(conceptScores)
        .filter(
          ([, data]) =>
            getLevel(getPercentage(data.correct, data.total)) === 'weak'
        )
        .map(([concept]) => concept),

      roadmap,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.data?._id) {
        throw new Error(
          data.error || data.message || 'Could not save quiz result.'
        );
      }

      // Store the complete MongoDB document including its unique ID
      savedResultRef.current = data.data;

      setSaveStatus('saved');

      console.log('Quiz result saved successfully:', data.data);

      return data.data;
    } catch (error) {
      setSaveStatus('error');
      setSaveError(error.message || 'Could not connect to the backend.');

      console.error('Failed to save quiz result:', error);

      throw error;
    }
  }

  // STEP 2: Send performance to Python AI
  // STEP 3: Save Python AI analysis to the same MongoDB document
  async function processQuizResult() {
    if (processingRef.current) return;

    processingRef.current = true;

    try {
      // First save quiz and obtain MongoDB document ID
      const savedResult = await saveQuizResult();

      const conceptScoresForAI = Object.fromEntries(
        Object.entries(conceptScores).map(([concept, result]) => [
          conceptNames[concept],
          {
            correct: result.correct,
            total: result.total,
          },
        ])
      );

      // Request Python AI analysis through Node.js
      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          concept_scores: conceptScoresForAI,
        }),
      });

      const aiResult = await response.json();

      if (!response.ok || !aiResult.success || !aiResult.data) {
        throw new Error(
          aiResult.detail ||
            aiResult.message ||
            'AI analysis request failed.'
        );
      }

      const aiData = aiResult.data;

      console.log('Python AI analysis successful:', aiData);

      // Save AI analysis against the SAME MongoDB quiz record
      try {
        const saveAIResponse = await fetch(
          `${API_URL}/${savedResult._id}/ai-analysis`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              aiAnalysis: aiData,
            }),
          }
        );

        const saveAIResult = await saveAIResponse.json();

        if (!saveAIResponse.ok || !saveAIResult.success) {
          throw new Error(
            saveAIResult.message ||
              saveAIResult.error ||
              'Could not save AI analysis.'
          );
        }

        console.log(
          'Python AI analysis saved successfully in MongoDB:',
          saveAIResult.data
        );
      } catch (error) {
        // AI analysis is still available for the current dashboard session
        console.error(
          'AI analysis succeeded, but MongoDB update failed:',
          error
        );
      }

      // Convert Python concept names back to React concept IDs
      const conceptIdsByName = Object.fromEntries(
        Object.entries(conceptNames).map(([id, name]) => [name, id])
      );

      const updatedConceptScores = Object.fromEntries(
        Object.entries(aiData.concept_analysis).map(([name, result]) => [
          conceptIdsByName[name],
          {
            correct: result.correct,
            total: result.total,
          },
        ]).filter(([concept]) => Boolean(concept))
      );

      const updatedRoadmap = aiData.roadmap
        .map((name) => conceptIdsByName[name])
        .filter(Boolean);

      // Send Python AI results to Dashboard
      onQuizComplete?.({
        score,
        totalQuestions: questions.length,
        overallPercentage,
        conceptScores: updatedConceptScores,
        strongConcepts: aiData.strong_concepts.length,
        weakConcepts: aiData.weak_concepts.length,
        roadmap: updatedRoadmap,
      });

    } catch (error) {
      console.error('Quiz processing or AI analysis failed:', error);

      // Fallback: keep normal quiz results if AI is unavailable
      onQuizComplete?.({
        score,
        totalQuestions: questions.length,
        overallPercentage,
        conceptScores,
        strongConcepts,
        weakConcepts,
        roadmap,
      });
    } finally {
      processingRef.current = false;
    }
  }

  // Automatically process quiz after the final answer
  useEffect(() => {
    if (!quizFinished) return;

    processQuizResult();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizFinished]);

  function restartQuiz() {
    savedResultRef.current = null;
    processingRef.current = false;

    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setAnswers([]);
    setSaveStatus('idle');
    setSaveError('');
  }

  function handleAnswer(option) {
    if (selectedAnswer !== '') return;

    const isCorrect = option === question.correctAnswer;

    setSelectedAnswer(option);

    setAnswers((previous) => [
      ...previous,
      {
        questionId: question.id,
        concept: question.concept,
        selectedAnswer: option,
        correct: isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }
  }

  function handleNextQuestion() {
    if (!selectedAnswer) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer('');
    }
  }

  return (
    <main className="quiz-page">
      <header className="quiz-navbar">
        <a className="quiz-brand" href="/">
          <span className="quiz-brand-icon">L</span>
          <span>
            LearnAdapt <span className="quiz-brand-ai">AI</span>
          </span>
        </a>

        <nav className="quiz-nav-links">
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
      </header>

      {!quizFinished ? (
        <section className="quiz-card">
          <div className="quiz-heading-block">
            <span className="quiz-eyebrow">
              LEARNADAPT AI · JAVASCRIPT
            </span>

            <h1>Knowledge Check</h1>

            <p className="quiz-description">
              Understand your strengths and discover what to learn next.
            </p>
          </div>

          <div className="quiz-progress-info">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span className="quiz-score-badge">Score: {score}</span>
          </div>

          <div
            className="quiz-progress-track"
            role="progressbar"
            aria-valuenow={currentQuestion + 1}
            aria-valuemin={1}
            aria-valuemax={questions.length}
            aria-label="Quiz progress"
          >
            <div
              className="quiz-progress-fill"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <h2 className="quiz-question">{question.question}</h2>

          <div className="quiz-options">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correctAnswer;

              let optionClass = 'quiz-option';

              if (selectedAnswer !== '' && isSelected && isCorrect) {
                optionClass += ' quiz-option-correct';
              } else if (
                selectedAnswer !== '' &&
                isSelected &&
                !isCorrect
              ) {
                optionClass += ' quiz-option-wrong';
              }

              return (
                <button
                  key={index}
                  type="button"
                  className={optionClass}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== ''}
                >
                  <span className="quiz-option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="quiz-option-text">{option}</span>

                  {selectedAnswer !== '' && isSelected && (
                    <span className="quiz-option-indicator">
                      {isCorrect ? '✓' : '×'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== '' && (
            <div
              className={`quiz-feedback ${
                selectedAnswer === question.correctAnswer
                  ? 'quiz-feedback-correct'
                  : 'quiz-feedback-wrong'
              }`}
              role="status"
            >
              {selectedAnswer === question.correctAnswer
                ? '✓ Correct answer! Great job.'
                : 'Not quite. Review this concept as you continue.'}
            </div>
          )}

          <button
            type="button"
            className="quiz-primary-button"
            disabled={selectedAnswer === ''}
            onClick={handleNextQuestion}
          >
            {currentQuestion === questions.length - 1
              ? 'Finish quiz'
              : 'Next question →'}
          </button>
        </section>
      ) : (
        <section className="quiz-results">
          <div className="quiz-results-hero">
            <span className="quiz-eyebrow">YOUR LEARNING REPORT</span>

            <h1>Quiz completed!</h1>

            <p className="quiz-description">
              Every result helps us personalize your learning journey.
            </p>

            <div className="quiz-score-circle">
              <strong>{overallPercentage}%</strong>
              <span>Overall score</span>
            </div>

            <p className="quiz-score-summary">
              You answered {score} out of {questions.length} questions
              correctly.
            </p>

            <div
              className="quiz-save-status"
              role="status"
              aria-live="polite"
            >
              {saveStatus === 'saving' && (
                <p>Saving your quiz result to the database…</p>
              )}

              {saveStatus === 'saved' && (
                <p>✓ Your quiz result has been saved successfully!</p>
              )}

              {saveStatus === 'error' && (
                <div>
                  <p>
                    We couldn't save your result. Your quiz report is still
                    available here.
                  </p>

                  <p>{saveError}</p>

                  <button
                    type="button"
                    className="quiz-primary-button"
                    onClick={processQuizResult}
                  >
                    Try saving again
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="quiz-result-card">
            <h2>Concept-wise performance</h2>

            <p className="quiz-description">
              See which JavaScript concepts you understand and which need
              more practice.
            </p>

            {Object.entries(conceptScores).map(([concept, result]) => {
              const percentage = getPercentage(
                result.correct,
                result.total
              );

              const level = getLevel(percentage);

              return (
                <div className="quiz-concept" key={concept}>
                  <div className="quiz-concept-header">
                    <strong>{conceptNames[concept] || concept}</strong>

                    <span className={`quiz-level quiz-level-${level}`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </div>

                  <div className="quiz-concept-details">
                    <span>
                      {result.correct} of {result.total} correct
                    </span>

                    <span>{percentage}%</span>
                  </div>

                  <div className="quiz-progress-track">
                    <div
                      className={`quiz-progress-fill quiz-fill-${level}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="quiz-result-card">
            <h2>Your personalized roadmap</h2>

            <p className="quiz-description">
              Start with concepts that need improvement, following their
              prerequisites.
            </p>

            {roadmap.length > 0 ? (
              <ol className="quiz-roadmap">
                {roadmap.map((concept, index) => (
                  <li
                    key={concept}
                    className="quiz-roadmap-item"
                  >
                    <span className="quiz-roadmap-number">
                      {index + 1}
                    </span>

                    <span>{conceptNames[concept] || concept}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="quiz-success-message">
                Excellent work! All assessed concepts are strong.
              </p>
            )}
          </div>

          <button
            type="button"
            className="quiz-primary-button quiz-retake-button"
            onClick={restartQuiz}
          >
            Retake quiz ↻
          </button>

          <a className="quiz-dashboard-link" href="/dashboard">
            Explore your dashboard →
          </a>
        </section>
      )}

      <footer className="quiz-footer">
        LearnAdapt AI · Learn Smarter. Learn Your Way.
      </footer>
    </main>
  );
}

export default Quiz;
