
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

  useEffect(() => {
    fetch('http://localhost:5001/api/quiz-results')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not fetch quiz results');
        }

        return response.json();
      })
      .then((data) => {
        if (data.success && data.data.length > 0) {
          const latestResult = data.data[0];

          const conceptScores = Object.fromEntries(
            Object.entries(latestResult.conceptScores || {}).map(
              ([concept, percentage]) => [
                concept,
                {
                  correct: Math.round(
                    (percentage / 100) * getConceptQuestionCount(concept)
                  ),
                  total: getConceptQuestionCount(concept),
                },
              ]
            )
          );

          setQuizResults({
            score: latestResult.score,
            totalQuestions: latestResult.totalQuestions,
            overallPercentage: latestResult.percentage,
            strongConcepts: Object.values(
              latestResult.conceptScores || {}
            ).filter((percentage) => percentage >= 80).length,
            weakConcepts: (latestResult.weakConcepts || []).length,
            conceptScores,
            roadmap: latestResult.roadmap || [],
          });
        }
      })
      .catch((error) => {
        console.error('Quiz results fetch error:', error);
      });
  }, []);

  function getConceptQuestionCount(concept) {
    const questionCounts = {
      'promise-basics': 3,
      'promise-states': 3,
      'then-catch': 3,
      'async-await': 3,
      'error-handling': 3,
    };

    return questionCounts[concept] || 0;
  }

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
