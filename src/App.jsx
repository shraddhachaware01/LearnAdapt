
import { useState } from 'react';
import Quiz from './Quiz.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  const [quizResults, setQuizResults] = useState(null);

  return (
    <div>
      <h1>LearnAdapt AI</h1>
      <p>Learn Smarter. Learn Your Way.</p>

      <Dashboard results={quizResults} />

      <Quiz onQuizComplete={setQuizResults} />
    </div>
  );
}

export default App;
