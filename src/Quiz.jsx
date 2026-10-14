
import { useState } from 'react';
import questions from './engine/question.js';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  return (
    <div>
      <h2>LearnAdapt AI Quiz</h2>
      <p>Your personalized learning journey starts here!</p>

      <h3>
        Question {currentQuestion + 1} of {questions.length}
      </h3>

      <h3>{questions[currentQuestion].question}</h3>

      {questions[currentQuestion].options.map((option, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <button>{option}</button>
        </div>
      ))}

      <button
        onClick={() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          }
        }}
      >
        Next
      </button>
    </div>
  );
}

export default Quiz;
