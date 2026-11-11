import VideosPage from './pages/videos/VideosPage.jsx';
import NoteDetail from './pages/notes/NoteDetail.jsx';
import NotesPage from './pages/notes/NotesPage.jsx';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Quiz from './Quiz.jsx';
import Dashboard from './Dashboard.jsx';
import Learn from './pages/Learn.jsx';
import Practice from './pages/Practice.jsx';

// Backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Python AI concept names mapped to React concept IDs
const conceptIdsByName = {
  'Promise Basics': 'promise-basics',
  'Promise States': 'promise-states',
  'Then & Catch': 'then-catch',
  'Async / Await': 'async-await',
  'Error Handling': 'error-handling',
};

// Number of questions per concept
const questionCounts = {
  'promise-basics': 3,
  'promise-states': 3,
  'then-catch': 3,
  'async-await': 3,
  'error-handling': 3,
};

// Convert MongoDB quiz result into Dashboard format
function formatQuizResult(latestResult) {
  const aiData = latestResult.aiAnalysis;

  // Use saved Python AI analysis if available
  if (aiData && aiData.concept_analysis) {
    const conceptScores = Object.fromEntries(
      Object.entries(aiData.concept_analysis)
        .map(([name, result]) => {
          const conceptId = conceptIdsByName[name];

          if (!conceptId) return null;

          return [
            conceptId,
            {
              correct: result.correct,
              total: result.total,
              percentage: result.percentage,
              level: result.level,
            },
          ];
        })
        .filter(Boolean)
    );

    const roadmap = (aiData.roadmap || [])
      .map((name) => conceptIdsByName[name])
      .filter(Boolean);

    return {
      score: latestResult.score,
      totalQuestions: latestResult.totalQuestions,
      overallPercentage: latestResult.percentage,
      conceptScores,
      strongConcepts: (aiData.strong_concepts || []).length,
      weakConcepts: (aiData.weak_concepts || []).length,
      roadmap,
      aiAnalysis: aiData,
    };
  }

  // Fallback for older quiz records without AI analysis
  const conceptScores = Object.fromEntries(
    Object.entries(latestResult.conceptScores || {}).map(
      ([concept, percentage]) => {
        const total = questionCounts[concept] || 0;

        return [
          concept,
          {
            correct: Math.round((percentage / 100) * total),
            total,
            percentage,
          },
        ];
      }
    )
  );

  return {
    score: latestResult.score,
    totalQuestions: latestResult.totalQuestions,
    overallPercentage: latestResult.percentage,

    strongConcepts: Object.values(
      latestResult.conceptScores || {}
    ).filter((percentage) => percentage >= 80).length,

    weakConcepts: (latestResult.weakConcepts || []).length,

    conceptScores,
    roadmap: latestResult.roadmap || [],
  };
}

function App() {
  const [quizResults, setQuizResults] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);

  const [backendMessage, setBackendMessage] = useState(
    'Checking backend connection...'
  );

  // Check backend connection
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
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

  // Fetch saved quiz results from MongoDB
  useEffect(() => {
    async function fetchQuizResults() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/quiz-results`
        );

        if (!response.ok) {
          throw new Error('Could not fetch quiz results');
        }

        const data = await response.json();

        if (data.success && data.data.length > 0) {
          // Store complete quiz history
          setQuizHistory(data.data);

          // Latest quiz result
          const latestResult = data.data[0];

          // Format saved AI analysis for Dashboard
          const formattedResult = formatQuizResult(latestResult);

          setQuizResults(formattedResult);

          console.log(
            'Latest quiz result loaded from MongoDB:',
            latestResult
          );

          if (latestResult.aiAnalysis) {
            console.log(
              'Saved Python AI analysis loaded:',
              latestResult.aiAnalysis
            );
          } else {
            console.log(
              'No saved Python AI analysis found for this quiz.'
            );
          }
        }
      } catch (error) {
        console.error('Quiz results fetch error:', error);
      }
    }

    fetchQuizResults();
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
            element={
              <Dashboard
                results={quizResults}
                quizHistory={quizHistory}
              />
            }
          />

          <Route path="/learn" element={<Learn />} />

          <Route path="/learn/practice" element={<Practice />} />
          <Route path="/notes" element={<NotesPage />} />
        
<Route path="/notes/:topicId" element={<NoteDetail />} />
<Route path="/videos" element={<VideosPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
