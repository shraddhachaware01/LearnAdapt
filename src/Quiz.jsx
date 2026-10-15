
import { useState } from 'react';
import questions from './engine/question.js';
import {
  calculateScores,
  getPercentage,
  getLevel,
  generateRoadmap
} from './engine/scoring.js';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const question = questions[currentQuestion];

  const quizFinished =
    currentQuestion === questions.length - 1 &&
    selectedAnswer !== '';

  // Calculate results for each concept using all quiz questions.
  const userAnswers = questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    return answer ? answer.selectedAnswer : undefined;
  });

  const conceptScores = calculateScores(questions, userAnswers);
  const roadmap = generateRoadmap(conceptScores);

  return (
    <div>
      {quizFinished ? (
        <div>
          <h2>Quiz Completed! 🎉</h2>
          <h3>
            Your Final Score: {score} / {questions.length}
          </h3>

          <h3>Concept-wise Results</h3>

          {Object.entries(conceptScores).map(([concept, result]) => {
            const percentage = getPercentage(
              result.correct,
              result.total
            );
            const level = getLevel(percentage);

            return (
              <div key={concept}>
                <p>
                  <strong>{concept}</strong>: {result.correct}/
                  {result.total} ({percentage}%)
                </p>
                <p>Level: {level}</p>
              </div>
            );
          })}

          <h3>Your Personalized Learning Roadmap 🗺️</h3>

          {roadmap.length > 0 ? (
            <ol>
              {roadmap.map((concept) => (
                <li key={concept}>
                  {concept.replaceAll('-', ' ')}
                </li>
              ))}
            </ol>
          ) : (
            <p>
              Excellent work! You are strong in all assessed concepts.
            </p>
          )}

          <p>Complete your roadmap topics to strengthen your JavaScript skills!</p>
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
                        selectedAnswer: option,
                        correct: isCorrect
                      }
                    ]);

                    if (isCorrect) {
                      setScore((previousScore) => previousScore + 1);
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
                setCurrentQuestion((previous) => previous + 1);
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
