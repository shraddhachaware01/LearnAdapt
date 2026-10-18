
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Quiz from './Quiz.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  const [quizResults, setQuizResults] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/quiz"
          element={<Quiz onQuizComplete={setQuizResults} />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard results={quizResults} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
