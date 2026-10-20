
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Quiz from './Quiz.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  const [quizResults, setQuizResults] = useState(null);
  const [backendMessage, setBackendMessage] = useState(
    'Checking backend connection...'
  );

  useEffect(() => {
    fetch('http://localhost:5001/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Backend request failed');
        }

        return response.json();
      })
      .then((data) => {
        setBackendMessage(data.message);
      })
      .catch((error) => {
        console.error('Backend connection error:', error);
        setBackendMessage('Could not connect to backend.');
      });
  }, []);

  return (
    <>
      <p
        style={{
          textAlign: 'center',
          padding: '10px',
          color: '#4f46e5',
          fontWeight: 'bold',
        }}
      >
        Backend Status: {backendMessage}
      </p>

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
    </>
  );
}

export default App;
