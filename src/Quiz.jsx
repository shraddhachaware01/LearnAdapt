
import { useState, useEffect, useRef } from 'react';
import questions from './engine/question.js';
import {
  calculateScores,
  getPercentage,
  getLevel,
  generateRoadmap,
} from './engine/scoring.js';
import './Quiz.css';

const API_URL = 'http://localhost:5001/api/quiz-results';

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

  const savedResultRef = useRef(false);

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

  async function saveQuizResult() {
    if (savedResultRef.current) return;

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

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || data.message || 'Could not save quiz result.'
        );
      }

      savedResultRef.current = true;
      setSaveStatus('saved');

      console.log('Quiz result saved successfully:', data.data);
    } catch (error) {
      setSaveStatus('error');
      setSaveError(error.message || 'Could not connect to the backend.');

      console.error('Failed to save quiz result:', error);
    }
  }

  useEffect(() => {
    if (!quizFinished) return;

    onQuizComplete?.({
      score,
      totalQuestions: questions.length,
      overallPercentage,
      conceptScores,
      strongConcepts,
      weakConcepts,
      roadmap,
    });

    if (!savedResultRef.current) {
      saveQuizResult();
    }
    // Run when the quiz is completed; the ref prevents duplicate saves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizFinished]);

  function restartQuiz() {
    savedResultRef.current = false;

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

            <div className="quiz-save-status" role="status" aria-live="polite">
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
                    onClick={saveQuizResult}
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
                  <li key={concept} className="quiz-roadmap-item">
                    <span className="quiz-roadmap-number">{index + 1}</span>

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
