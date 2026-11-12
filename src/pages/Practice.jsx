
import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Supports local development and production deployment
const API_URL = `${
  import.meta.env.VITE_API_URL || 'http://localhost:5001'
}/api/practice-results`;

const practiceQuestions = {
  'promise-basics': [
    {
      question: 'What does a JavaScript Promise represent?',
      options: [
        'The eventual result of an asynchronous operation',
        'A loop that runs forever',
        'A function that must run immediately',
        'A CSS animation',
      ],
      answer: 0,
      explanation:
        'A Promise represents the eventual fulfillment or rejection of an asynchronous operation.',
      difficulty: 'easy',
      gapType: 'conceptual',
      skill: 'understanding-promises',
    },
    {
      question: 'Which method handles a fulfilled Promise value?',
      options: ['catch()', 'then()', 'repeat()', 'query()'],
      answer: 1,
      explanation:
        'then() registers a handler that runs when the Promise fulfills.',
      difficulty: 'easy',
      gapType: 'conceptual',
      skill: 'promise-then-method',
    },
    {
      question: 'What does resolve("Done") do inside a Promise executor?',
      options: [
        'Deletes the Promise',
        'Restarts the executor',
        'Fulfills the Promise with "Done"',
        'Creates a new Promise every second',
      ],
      answer: 2,
      explanation:
        'Calling resolve with a value fulfills the Promise with that value, unless it has already settled.',
      difficulty: 'medium',
      gapType: 'application',
      skill: 'promise-resolve-value',
    },
  ],

  'promise-states': [
    {
      question: 'Which are the three standard Promise states?',
      options: [
        'Start, stop, and restart',
        'Pending, fulfilled, and rejected',
        'Open, closed, and paused',
        'True, false, and null',
      ],
      answer: 1,
      explanation:
        'A Promise starts pending and eventually becomes fulfilled or rejected.',
      difficulty: 'easy',
      gapType: 'conceptual',
      skill: 'promise-states',
    },
    {
      question: 'What does a fulfilled Promise indicate?',
      options: [
        'The operation completed successfully',
        'The operation has not settled',
        'The operation necessarily failed',
        'The application has stopped',
      ],
      answer: 0,
      explanation:
        'Fulfilled means the Promise completed successfully with a fulfillment value.',
      difficulty: 'easy',
      gapType: 'conceptual',
      skill: 'fulfilled-promise-state',
    },
    {
      question: 'Can a settled Promise change from fulfilled to rejected?',
      options: [
        'Yes, every time then() runs',
        'Yes, after one second',
        'Only when catch() is called',
        'No, its settled state does not change',
      ],
      answer: 3,
      explanation:
        'Once fulfilled or rejected, a Promise cannot change its own state.',
      difficulty: 'medium',
      gapType: 'logical',
      skill: 'promise-state-transitions',
    },
  ],

  'then-catch': [
    {
      question: 'Which method is commonly used to handle a Promise rejection?',
      options: ['map()', 'catch()', 'start()', 'repeat()'],
      answer: 1,
      explanation:
        'catch() registers a rejection handler for a Promise chain.',
      difficulty: 'easy',
      gapType: 'conceptual',
      skill: 'promise-catch-method',
    },
    {
      question: 'What happens when a then() callback returns 20?',
      options: [
        'The current Promise is deleted',
        'The entire application closes',
        'The next Promise in the chain receives 20',
        'The callback is never executed',
      ],
      answer: 2,
      explanation:
        'A returned value fulfills the Promise produced by then(), making that value available to the next handler.',
      difficulty: 'medium',
      gapType: 'logical',
      skill: 'then-chain-value',
    },
    {
      question: 'What does this code print?',
      code: 'Promise.resolve(5).then(value => value * 2).then(console.log);',
      options: ['5', '10', 'undefined', 'An error'],
      answer: 1,
      explanation:
        'The first callback doubles 5 to 10, and the next callback logs 10.',
      difficulty: 'medium',
      gapType: 'application',
      skill: 'promise-chain-output',
    },
  ],

  'async-await': [
    {
      question: 'What does an async function return?',
      options: [
        'Always a Promise',
        'Only a string',
        'Only undefined',
        'A DOM element',
      ],
      answer: 0,
      explanation:
        'An async function always returns a Promise. A returned value becomes its fulfillment value.',
      difficulty: 'medium',
      gapType: 'conceptual',
      skill: 'async-function-return',
    },
    {
      question: 'Where can await normally be used in standard JavaScript?',
      options: [
        'Only inside a CSS rule',
        'Only inside a for loop',
        'Inside an async function or at supported top-level module scope',
        'Only inside a class constructor',
      ],
      answer: 2,
      explanation:
        'await can be used in async functions and, in supported environments, at the top level of a JavaScript module.',
      difficulty: 'medium',
      gapType: 'conceptual',
      skill: 'await-usage',
    },
    {
      question: 'Does await block the entire JavaScript thread while a Promise is pending?',
      options: [
        'Yes, always',
        'No, it suspends the async function while other work can continue',
        'Yes, until the browser closes',
        'Only when the Promise fulfills',
      ],
      answer: 1,
      explanation:
        'await suspends the surrounding async function, not the entire JavaScript thread.',
      difficulty: 'hard',
      gapType: 'logical',
      skill: 'await-execution-flow',
    },
  ],

  'error-handling': [
    {
      question: 'Which structure can handle an exception thrown inside an async function?',
      options: ['if/else only', 'for/while', 'switch/case only', 'try/catch'],
      answer: 3,
      explanation:
        'try/catch can catch exceptions thrown in the try block, including errors from an awaited rejected Promise.',
      difficulty: 'medium',
      gapType: 'application',
      skill: 'async-error-handling',
    },
    {
      question: 'What does catch() do in a Promise chain?',
      options: [
        'Handles a rejection in the chain',
        'Automatically repeats the operation',
        'Guarantees every request succeeds',
        'Converts the result into HTML',
      ],
      answer: 0,
      explanation:
        'catch() handles a rejection from an earlier part of the Promise chain.',
      difficulty: 'easy',
      gapType: 'conceptual',
      skill: 'promise-rejection-handling',
    },
    {
      question: 'What is a useful practice when handling an error?',
      options: [
        'Ignore every error',
        'Hide all errors without investigation',
        'Provide useful error information and handle the failure appropriately',
        'Restart the browser for every error',
      ],
      answer: 2,
      explanation:
        'Useful error information helps the application respond appropriately and helps developers diagnose failures.',
      difficulty: 'medium',
      gapType: 'application',
      skill: 'error-handling-practice',
    },
  ],
};

const conceptNames = {
  'promise-basics': 'Promise Basics',
  'promise-states': 'Promise States',
  'then-catch': 'Then & Catch',
  'async-await': 'Async / Await',
  'error-handling': 'Error Handling',
};

function Practice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const concept = searchParams.get('concept') || 'promise-basics';
  const questions = practiceQuestions[concept] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const questionStartTimeRef = useRef(Date.now());

  async function savePracticeResult(finalAnswers) {
    setSaveStatus('saving');
    setSaveMessage('Saving your practice result...');

    const score = finalAnswers.filter((answer) => answer.correct).length;
    const percentage = Math.round((score / questions.length) * 100);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          concept,
          score,
          totalQuestions: questions.length,
          percentage,
          answers: finalAnswers,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Could not save your result.'
        );
      }

      setSaveStatus('saved');
      setSaveMessage('Practice result saved successfully! 💜');
    } catch (error) {
      console.error('Practice result save error:', error);
      setSaveStatus('error');
      setSaveMessage(
        'Your quiz is complete, but saving failed. Check the backend and try again.'
      );
    }
  }

  function selectAnswer(optionIndex) {
    if (selectedAnswer !== null || finished) return;

    const currentQuestion = questions[currentIndex];
    // Keep fractional seconds so quick answers are not all recorded as 1 second.
    const elapsedMilliseconds = Date.now() - questionStartTimeRef.current;
    const timeTakenSeconds = Math.max(
      0.01,
      Number((elapsedMilliseconds / 1000).toFixed(2))
    );

    setSelectedAnswer(optionIndex);

    setAnswers((previous) => [
      ...previous,
      {
        questionIndex: currentIndex,
        selectedAnswer: optionIndex,
        correct: optionIndex === currentQuestion.answer,
        timeTakenSeconds,
        difficulty: currentQuestion.difficulty,
        gapType: currentQuestion.gapType,
        skill: currentQuestion.skill,
      },
    ]);
  }

  function nextQuestion() {
    if (selectedAnswer === null || finished) return;

    if (currentIndex === questions.length - 1) {
      // The answer was recorded when the student selected an option.
      const finalAnswers = answers;
      setFinished(true);
      savePracticeResult(finalAnswers);
    } else {
      setCurrentIndex((previous) => previous + 1);
      setSelectedAnswer(null);
      questionStartTimeRef.current = Date.now();
    }
  }

  function restartPractice() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setFinished(false);
    setSaveStatus('idle');
    setSaveMessage('');
    questionStartTimeRef.current = Date.now();
  }

  const score = answers.filter((answer) => answer.correct).length;

  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  if (!questions.length) {
    return (
      <main style={styles.page}>
        <h1>Practice not available</h1>
        <p>Please select a JavaScript concept from your learning roadmap.</p>
        <button
          style={styles.primaryButton}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  if (finished) {
    return (
      <main style={styles.page}>
        <section style={styles.header}>
          <p style={styles.eyebrow}>LEARNADAPT AI · PRACTICE</p>
          <h1 style={styles.heading}>Practice Complete! 💜</h1>
          <h2 style={styles.resultScore}>
            {score} / {questions.length} correct
          </h2>
          <p style={styles.headerText}>
            Your practice score is {percentage}%.
          </p>

          <p
            role="status"
            aria-live="polite"
            style={{
              ...styles.saveMessage,
              color:
                saveStatus === 'error'
                  ? '#991b1b'
                  : saveStatus === 'saved'
                    ? '#166534'
                    : '#5141c5',
            }}
          >
            {saveMessage}
          </p>

          {saveStatus === 'error' && (
            <button
              style={styles.secondaryButton}
              onClick={() => savePracticeResult(answers)}
            >
              Retry Saving
            </button>
          )}

          <div
            style={styles.resultTrack}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              style={{
                ...styles.progressFill,
                width: `${percentage}%`,
              }}
            />
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardHeading}>Review your answers</h2>

          {questions.map((item, index) => {
            const answer = answers.find(
              (entry) => entry.questionIndex === index
            );

            return (
              <div key={index} style={styles.review}>
                <strong style={styles.reviewQuestion}>
                  {index + 1}. {item.question}
                </strong>

                {item.code && (
                  <pre style={styles.code}>{item.code}</pre>
                )}

                <p style={styles.reviewText}>
                  Your answer:{' '}
                  {item.options[answer?.selectedAnswer ?? -1] ||
                    'Not answered'}
                </p>

                <p style={styles.correctAnswer}>
                  Correct answer: {item.options[item.answer]}
                </p>

                <p style={styles.reviewText}>{item.explanation}</p>
              </div>
            );
          })}
        </section>

        <div style={styles.actions}>
          <button style={styles.primaryButton} onClick={restartPractice}>
            Try Again
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() =>
              navigate(`/learn?concept=${encodeURIComponent(concept)}`)
            }
          >
            Back to Lesson
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
        </div>
      </main>
    );
  }

  const question = questions[currentIndex];

  return (
    <main style={styles.page}>
      <button
        style={styles.backButton}
        onClick={() =>
          navigate(`/learn?concept=${encodeURIComponent(concept)}`)
        }
      >
        ← Back to Lesson
      </button>

      <section style={styles.header}>
        <p style={styles.eyebrow}>LEARNADAPT AI · PRACTICE</p>
        <h1 style={styles.heading}>
          {conceptNames[concept] || concept}
        </h1>
        <p style={styles.headerText}>
          Question {currentIndex + 1} of {questions.length}
        </p>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardHeading}>{question.question}</h2>
        <p style={styles.questionMeta}>Difficulty: {question.difficulty} · Skill: {question.skill}</p>

        {question.code && (
          <pre style={styles.code}>{question.code}</pre>
        )}

        <div style={styles.options}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.answer;

            let background = '#ffffff';
            let border = '1px solid #ded9ef';
            let color = '#292541';

            if (selectedAnswer !== null && isCorrect) {
              background = '#e7f8ec';
              border = '1px solid #43a66b';
              color = '#166534';
            } else if (isSelected && !isCorrect) {
              background = '#fff0f0';
              border = '1px solid #d9534f';
              color = '#991b1b';
            }

            return (
              <button
                key={option}
                type="button"
                disabled={selectedAnswer !== null}
                onClick={() => selectAnswer(index)}
                style={{
                  ...styles.option,
                  background,
                  border,
                  color,
                  cursor:
                    selectedAnswer !== null ? 'default' : 'pointer',
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div
            style={{
              ...styles.feedback,
              background:
                selectedAnswer === question.answer
                  ? '#effaf2'
                  : '#fff5f5',
              borderColor:
                selectedAnswer === question.answer
                  ? '#86d19b'
                  : '#f0aaaa',
            }}
            role="status"
          >
            <strong
              style={{
                color:
                  selectedAnswer === question.answer
                    ? '#166534'
                    : '#991b1b',
              }}
            >
              {selectedAnswer === question.answer
                ? 'Correct! 🎉'
                : 'Not quite — learn from this one.'}
            </strong>
            <p style={styles.feedbackText}>{question.explanation}</p>
          </div>
        )}

        <button
          style={{
            ...styles.primaryButton,
            opacity: selectedAnswer === null ? 0.55 : 1,
            cursor:
              selectedAnswer === null ? 'not-allowed' : 'pointer',
          }}
          disabled={selectedAnswer === null}
          onClick={nextQuestion}
        >
          {currentIndex === questions.length - 1
            ? 'View Results'
            : 'Next Question →'}
        </button>
      </section>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: '850px',
    margin: '0 auto',
    padding: '32px 20px 60px',
    fontFamily: 'Arial, sans-serif',
    color: '#24213b',
    background: '#f8f9ff',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },

  backButton: {
    border: 'none',
    background: 'transparent',
    color: '#5141c5',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '15px',
    fontWeight: '600',
    padding: '8px 0',
  },

  header: {
    padding: '28px',
    borderRadius: '18px',
    background: '#f0edff',
    marginBottom: '22px',
    textAlign: 'center',
    color: '#24213b',
  },

  eyebrow: {
    color: '#5141c5',
    fontWeight: 'bold',
    letterSpacing: '1px',
    fontSize: '12px',
  },

  heading: {
    color: '#24213b',
    fontSize: '32px',
    lineHeight: 1.25,
    margin: '18px 0',
  },

  headerText: {
    color: '#39344f',
    fontSize: '16px',
    lineHeight: 1.6,
  },

  resultScore: {
    color: '#24213b',
    fontSize: '26px',
  },

  saveMessage: {
    fontSize: '14px',
    lineHeight: 1.6,
    fontWeight: '600',
  },

  resultTrack: {
    height: '8px',
    background: '#dcd6f5',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '18px',
  },

  card: {
    padding: '24px',
    border: '1px solid #e2def0',
    borderRadius: '16px',
    marginBottom: '22px',
    background: '#ffffff',
    color: '#24213b',
  },

  cardHeading: {
    color: '#292541',
    fontSize: '23px',
    lineHeight: 1.5,
    marginTop: '0',
  },

  questionMeta: {
    color: '#6b6680',
    fontSize: '13px',
    marginTop: '-10px',
    marginBottom: '16px',
  },

  options: {
    display: 'grid',
    gap: '12px',
    margin: '22px 0',
  },

  option: {
    textAlign: 'left',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '15px',
    lineHeight: 1.6,
    fontFamily: 'Arial, sans-serif',
    fontWeight: '500',
    width: '100%',
  },

  code: {
    padding: '16px',
    borderRadius: '10px',
    background: '#201d32',
    color: '#f3f0ff',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    fontSize: '14px',
  },

  feedback: {
    padding: '16px',
    border: '1px solid',
    borderRadius: '10px',
    lineHeight: 1.6,
    marginBottom: '20px',
  },

  feedbackText: {
    color: '#292541',
    marginBottom: '0',
  },

  progressTrack: {
    height: '8px',
    background: '#dcd6f5',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '16px',
  },

  progressFill: {
    height: '100%',
    background: '#6554d9',
    transition: 'width 0.2s ease',
    borderRadius: '10px',
  },

  review: {
    borderBottom: '1px solid #e9e6f2',
    padding: '16px 0',
    lineHeight: 1.6,
  },

  reviewQuestion: {
    display: 'block',
    color: '#292541',
    fontSize: '16px',
    marginBottom: '10px',
  },

  reviewText: {
    color: '#454057',
    lineHeight: 1.7,
  },

  correctAnswer: {
    color: '#166534',
    fontWeight: '600',
    lineHeight: 1.7,
  },

  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '8px',
  },

  primaryButton: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '10px',
    background: '#6554d9',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
  },

  secondaryButton: {
    padding: '12px 16px',
    border: '1px solid #d9d3ee',
    borderRadius: '10px',
    background: '#ffffff',
    color: '#39344f',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'Arial, sans-serif',
  },
};

export default Practice;
