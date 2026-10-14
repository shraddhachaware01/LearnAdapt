
import { useState } from 'react';
import questions from './engine/question.js';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const question = questions[currentQuestion];

  const quizFinished =
    currentQuestion === questions.length - 1 &&
    selectedAnswer !== '';

  return (
    <div>
      {quizFinished ? (
        <div>
          <h2>Quiz Completed! 🎉</h2>
          <h3>
            Your Final Score: {score} / {questions.length}
          </h3>
          <p>You have completed all the questions!</p>

          <h3>Concept-wise Results</h3>

          {questions.reduce((results, q) => {
            if (!results[q.concept]) {
              results[q.concept] = { total: 0, correct: 0 };
            }

            results[q.concept].total += 1;

            const answer = answers.find(
              (a) => a.concept === q.concept && a.questionId === q.id
            );

            if (answer?.correct) {
              results[q.concept].correct += 1;
            }

            return results;
          }, {}) &&
            Object.entries(
              questions.reduce((results, q) => {
                if (!results[q.concept]) {
                  results[q.concept] = { total: 0, correct: 0 };
                }

                results[q.concept].total += 1;

                const answer = answers.find(
                  (a) => a.questionId === q.id
                );

                if (answer?.correct) {
                  results[q.concept].correct += 1;
                }

                return results;
              }, {})
            ).map(([concept, result]) => (
              <p key={concept}>
                {concept}: {result.correct}/{result.total} correct
                {' — '}
                {result.correct / result.total >= 0.8
                  ? 'Strong'
                  : result.correct / result.total >= 0.5
                    ? 'Medium'
                    : 'Weak'}
              </p>
            ))}
        </div>
      ) : (
        <>
          <h2>LearnAdapt AI Quiz</h2>
          <h3>Score: {score}</h3>
          <p>Your personalized learning journey starts here!</p>

          <h3>
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <h3>{question.question}</h3>

          {question.options.map((option, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <button
                onClick={() => {
                  if (selectedAnswer === '') {
                    const isCorrect =
                      option === question.correctAnswer;

                    setSelectedAnswer(option);

                    setAnswers([
                      ...answers,
                      {
                        questionId: question.id,
                        concept: question.concept,
                        correct: isCorrect
                      }
                    ]);

                    if (isCorrect) {
                      setScore(score + 1);
                    }
                  }
                }}
                disabled={selectedAnswer !== ''}
              >
                {option}
              </button>
            </div>
          ))}

          {selectedAnswer !== '' && (
            <p>
              {selectedAnswer === question.correctAnswer
                ? 'Correct answer! 🎉'
                : 'Wrong answer. Try again!'}
            </p>
          )}

          <button
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer('');
              }
            }}
            disabled={selectedAnswer === ''}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

export default Quiz;
