
import { useState, useEffect } from 'react';
import questions from './engine/question.js';
import {
  calculateScores,
  getPercentage,
  getLevel,
  generateRoadmap
} from './engine/scoring.js';

const conceptNames = {
  'promise-basics': 'Promise Basics',
  'promise-states': 'Promise States',
  'then-catch': 'Then & Catch',
  'async-await': 'Async / Await',
  'error-handling': 'Error Handling'
};

function Quiz({ onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

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

  // Send the completed quiz results to App.jsx.
  useEffect(() => {
    if (quizFinished) {
      onQuizComplete?.({
        score,
        totalQuestions: questions.length,
        overallPercentage,
        conceptScores,
        strongConcepts,
        weakConcepts,
        roadmap
      });
    }
  }, [quizFinished, onQuizComplete]);

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setAnswers([]);
  }

  return (
    <main style={styles.container}>
      {!quizFinished ? (
        <section style={styles.card}>
          <p style={styles.eyebrow}>LEARNADAPT AI · JAVASCRIPT</p>
          <h2 style={styles.heading}>Knowledge Check</h2>
          <p style={styles.muted}>
            Understand your strengths and discover what to learn next.
          </p>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${((currentQuestion + 1) / questions.length) * 100}%`
              }}
            />
          </div>

          <div style={styles.row}>
            <span style={styles.muted}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span style={styles.scoreBadge}>Score: {score}</span>
          </div>

          <h3 style={styles.question}>{question.question}</h3>

          <div style={styles.options}>
            {question.options.map((option, index) => (
              <button
                key={index}
                style={{
                  ...styles.option,
                  ...(selectedAnswer === option
                    ? option === question.correctAnswer
                      ? styles.correctOption
                      : styles.wrongOption
                    : {})
                }}
                onClick={() => {
                  if (selectedAnswer !== '') return;

                  const isCorrect = option === question.correctAnswer;

                  setSelectedAnswer(option);

                  setAnswers((previous) => [
                    ...previous,
                    {
                      questionId: question.id,
                      concept: question.concept,
                      selectedAnswer: option,
                      correct: isCorrect
                    }
                  ]);

                  if (isCorrect) {
                    setScore((previous) => previous + 1);
                  }
                }}
                disabled={selectedAnswer !== ''}
              >
                <span style={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </button>
            ))}
          </div>

          {selectedAnswer !== '' && (
            <p
              style={{
                ...styles.feedback,
                color:
                  selectedAnswer === question.correctAnswer
                    ? '#16803d'
                    : '#c0392b'
              }}
            >
              {selectedAnswer === question.correctAnswer
                ? 'Correct answer! Great job.'
                : 'Not quite. Review this concept as you continue.'}
            </p>
          )}

          <button
            style={{
              ...styles.primaryButton,
              opacity: selectedAnswer === '' ? 0.5 : 1
            }}
            disabled={selectedAnswer === ''}
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion((previous) => previous + 1);
                setSelectedAnswer('');
              }
            }}
          >
            {currentQuestion === questions.length - 1
              ? 'Finish quiz'
              : 'Next question →'}
          </button>
        </section>
      ) : (
        <section style={styles.results}>
          <div style={styles.hero}>
            <p style={styles.eyebrow}>YOUR LEARNING REPORT</p>
            <h2 style={styles.heading}>Quiz completed!</h2>
            <p style={styles.muted}>
              Every result helps us personalize your learning journey.
            </p>

            <div style={styles.scoreCircle}>
              <strong style={styles.bigScore}>{overallPercentage}%</strong>
              <span style={styles.muted}>Overall score</span>
            </div>

            <p style={styles.scoreSummary}>
              You answered {score} out of {questions.length} questions correctly.
            </p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionHeading}>Concept-wise performance</h3>
            <p style={styles.muted}>
              See which JavaScript concepts you understand and which need more practice.
            </p>

            {Object.entries(conceptScores).map(([concept, result]) => {
              const percentage = getPercentage(
                result.correct,
                result.total
              );
              const level = getLevel(percentage);

              const levelColor =
                level === 'strong'
                  ? '#16803d'
                  : level === 'medium'
                    ? '#9a6700'
                    : '#c0392b';

              return (
                <div key={concept} style={styles.concept}>
                  <div style={styles.row}>
                    <strong>{conceptNames[concept] || concept}</strong>
                    <span style={{ ...styles.level, color: levelColor }}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </div>

                  <div style={styles.row}>
                    <span style={styles.muted}>
                      {result.correct} of {result.total} correct
                    </span>
                    <span style={styles.muted}>{percentage}%</span>
                  </div>

                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${percentage}%`,
                        background: levelColor
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionHeading}>
              Your personalized roadmap
            </h3>
            <p style={styles.muted}>
              Start with concepts that need improvement, following their prerequisites.
            </p>

            {roadmap.length > 0 ? (
              <ol style={styles.roadmap}>
                {roadmap.map((concept, index) => (
                  <li key={concept} style={styles.roadmapItem}>
                    <span style={styles.roadmapNumber}>{index + 1}</span>
                    <span>{conceptNames[concept] || concept}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p style={styles.successMessage}>
                Excellent work! All assessed concepts are strong.
              </p>
            )}
          </div>

          <button style={styles.primaryButton} onClick={restartQuiz}>
            Retake quiz ↻
          </button>
        </section>
      )}
    </main>
  );
}

const styles = {
  container: {
    maxWidth: '760px',
    margin: '32px auto',
    padding: '16px',
    color: '#172033',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e4e7ec',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 18px rgba(16, 24, 40, 0.04)'
  },
  results: { display: 'flex', flexDirection: 'column', gap: '4px' },
  hero: {
    textAlign: 'center',
    background: '#f3f6ff',
    borderRadius: '18px',
    padding: '28px 20px',
    marginBottom: '20px'
  },
  eyebrow: {
    color: '#5365b1',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1.5px'
  },
  heading: { fontSize: '28px', margin: '12px 0' },
  muted: { color: '#667085', fontSize: '14px', lineHeight: 1.6 },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  },
  scoreBadge: {
    background: '#edf1ff',
    color: '#4053a3',
    borderRadius: '20px',
    padding: '7px 12px',
    fontSize: '13px',
    fontWeight: '700'
  },
  progressTrack: {
    height: '8px',
    background: '#eaecf0',
    borderRadius: '20px',
    overflow: 'hidden',
    margin: '16px 0'
  },
  progressFill: {
    height: '100%',
    background: '#596bd8',
    borderRadius: '20px',
    transition: 'width 0.2s ease'
  },
  question: { fontSize: '21px', lineHeight: 1.5, margin: '28px 0 20px' },
  options: { display: 'grid', gap: '12px' },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '14px',
    textAlign: 'left',
    border: '1px solid #d0d5dd',
    borderRadius: '10px',
    background: '#ffffff',
    color: '#172033',
    cursor: 'pointer',
    fontSize: '15px'
  },
  optionLetter: {
    display: 'grid',
    placeItems: 'center',
    minWidth: '28px',
    height: '28px',
    borderRadius: '8px',
    background: '#f2f4f7',
    fontWeight: '700'
  },
  correctOption: { border: '1px solid #16803d', background: '#effaf2' },
  wrongOption: { border: '1px solid #c0392b', background: '#fff2f0' },
  feedback: { fontWeight: '700', fontSize: '14px' },
  primaryButton: {
    width: '100%',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 18px',
    background: '#465bd1',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '12px'
  },
  scoreCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '8px solid #dce3ff',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    margin: '24px auto'
  },
  bigScore: { fontSize: '34px', color: '#465bd1' },
  scoreSummary: { fontWeight: '700', fontSize: '14px' },
  sectionHeading: { fontSize: '19px', marginTop: 0 },
  concept: { padding: '16px 0', borderBottom: '1px solid #eaecf0' },
  level: { fontSize: '13px', fontWeight: '700' },
  roadmap: { listStyle: 'none', padding: 0, margin: '20px 0' },
  roadmapItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 0',
    borderBottom: '1px solid #eaecf0',
    fontWeight: '600'
  },
  roadmapNumber: {
    display: 'grid',
    placeItems: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#edf1ff',
    color: '#465bd1',
    flexShrink: 0
  },
  successMessage: {
    background: '#effaf2',
    color: '#16803d',
    padding: '16px',
    borderRadius: '10px',
    lineHeight: 1.5
  }
};

export default Quiz;
