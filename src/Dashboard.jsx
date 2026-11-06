
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import learningResources from './engine/resources.js';
import './Dashboard.css';

const conceptNames = {
  'promise-basics': 'Promise Basics',
  'promise-states': 'Promise States',
  'then-catch': 'Then & Catch',
  'async-await': 'Async / Await',
  'error-handling': 'Error Handling',
};

function Dashboard({ results }) {
  const navigate = useNavigate();

  const [practiceHistory, setPracticeHistory] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(true);
  const [practiceError, setPracticeError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchPracticeHistory() {
      try {
        setPracticeLoading(true);
        setPracticeError('');

        const response = await fetch(
          'http://localhost:5001/api/practice-results'
        );

        if (!response.ok) {
          throw new Error('Could not load practice history.');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error('Could not load practice history.');
        }

        if (!cancelled) {
          setPracticeHistory(data.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          setPracticeError(error.message);
        }
      } finally {
        if (!cancelled) {
          setPracticeLoading(false);
        }
      }
    }

    fetchPracticeHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      title: 'Overall Score',
      value: results ? `${results.overallPercentage}%` : '—',
      description: results
        ? `${results.score} of ${results.totalQuestions} questions correct`
        : 'Complete the quiz to see your score',
      icon: '🎯',
    },
    {
      title: 'Strong Concepts',
      value: results ? results.strongConcepts : '—',
      description: 'Concepts you understand well',
      icon: '💪',
    },
    {
      title: 'Needs Practice',
      value: results ? results.weakConcepts : '—',
      description: 'Concepts to improve',
      icon: '📚',
    },
  ];

  const filteredResources = Object.entries(learningResources).filter(
    ([concept]) => !results || results.roadmap.includes(concept)
  );

  const startPractice = (concept) => {
    navigate(
      `/learn/practice?concept=${encodeURIComponent(concept)}`
    );
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">LEARNADAPT AI</p>
          <h1>Student Dashboard</h1>
          <p className="dashboard-subtitle">
            Understand your progress. Improve at your own pace.
          </p>
        </div>
        <span className="dashboard-avatar">🎓</span>
      </header>

      {/* Performance Statistics */}
      <section className="dashboard-stats">
        {stats.map((stat) => (
          <article
            className="dashboard-stat-card"
            key={stat.title}
          >
            <span className="dashboard-stat-icon">{stat.icon}</span>
            <p className="dashboard-stat-title">{stat.title}</p>
            <h2 className="dashboard-stat-value">{stat.value}</h2>
            <p className="dashboard-stat-description">
              {stat.description}
            </p>
          </article>
        ))}
      </section>

      {/* Learning Progress */}
      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">YOUR PERFORMANCE</p>
            <h2>JavaScript Learning Progress</h2>
          </div>
          <span className="dashboard-heading-icon">📈</span>
        </div>

        <p className="dashboard-subtitle">
          {results
            ? 'Your performance across assessed concepts.'
            : 'Your concept-wise progress will appear after the quiz.'}
        </p>

        {results &&
          Object.entries(results.conceptScores).map(
            ([concept, result]) => {
              const percentage =
                result.total === 0
                  ? 0
                  : Math.round(
                      (result.correct / result.total) * 100
                    );

              const level =
                percentage < 50
                  ? 'Needs practice'
                  : percentage < 80
                  ? 'Developing'
                  : 'Strong';

              const levelClass =
                percentage < 50
                  ? 'weak'
                  : percentage < 80
                  ? 'medium'
                  : 'strong';

              return (
                <div className="dashboard-concept" key={concept}>
                  <div className="dashboard-concept-heading">
                    <strong>
                      {conceptNames[concept] || concept}
                    </strong>
                    <span className={`dashboard-level ${levelClass}`}>
                      {level}
                    </span>
                  </div>

                  <div className="dashboard-progress-track">
                    <div
                      className={`dashboard-progress-fill ${levelClass}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="dashboard-subtitle">
                    {result.correct} of {result.total} correct · {percentage}%
                  </p>
                </div>
              );
            }
          )}
      </section>

      {/* Personalized Learning Roadmap */}
      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">YOUR NEXT STEPS</p>
            <h2>Your Personalized Learning Roadmap</h2>
          </div>
        </div>

        {!results ? (
          <p className="dashboard-subtitle">
            Complete the JavaScript quiz to receive personalized learning
            recommendations.
          </p>
        ) : results.roadmap.length > 0 ? (
          <>
            <p className="dashboard-subtitle">
              Focus on these concepts in the recommended order:
            </p>

            <ol className="dashboard-roadmap-list">
              {results.roadmap.map((concept, index) => (
                <li key={concept}>
                  <span className="dashboard-roadmap-number">
                    {index + 1}
                  </span>
                  <span>{conceptNames[concept] || concept}</span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="dashboard-subtitle">
            Excellent work! All assessed concepts are strong. Keep
            practising to maintain your progress.
          </p>
        )}
      </section>

      {/* Recommended Learning Resources */}
      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">KEEP LEARNING</p>
            <h2>📚 Recommended Learning Resources</h2>
          </div>
        </div>

        <p className="dashboard-subtitle">
          {results
            ? 'Resources selected for your personalized learning roadmap.'
            : 'Complete the quiz to receive resources tailored to your needs.'}
        </p>

        {!results ? (
          <p className="dashboard-empty-message">
            Your learning resources will be personalized after your quiz.
          </p>
        ) : filteredResources.length > 0 ? (
          <div className="dashboard-resources">
            {filteredResources.map(([concept, resources]) => (
              <article
                className="dashboard-resource-card"
                key={concept}
              >
                <h3>{conceptNames[concept] || concept}</h3>

                {resources.map((resource) => (
                  <a
                    className="dashboard-resource-link"
                    key={resource.url}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{resource.title}</span>
                    <span aria-hidden="true"> ↗</span>
                    <small>{resource.type}</small>
                  </a>
                ))}
              </article>
            ))}
          </div>
        ) : (
          <p className="dashboard-empty-message">
            🎉 All concepts are strong! You can revisit any concept to keep
            practising.
          </p>
        )}
      </section>

      {/* NEW: Direct Practice Quiz Access */}
      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">TEST YOUR KNOWLEDGE</p>
            <h2>Practice JavaScript Concepts</h2>
          </div>
          <span className="dashboard-heading-icon">✍️</span>
        </div>

        <p className="dashboard-subtitle">
          Choose any concept and practice what you have learned.
        </p>

        <div className="dashboard-resources">
          {Object.entries(conceptNames).map(([concept, name]) => (
            <article
              className="dashboard-resource-card"
              key={concept}
            >
              <h3>{name}</h3>

              <p className="dashboard-subtitle">
                Test your understanding with practice questions.
              </p>

              <button onClick={() => startPractice(concept)}>
                Start Practice →
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Practice History */}
      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">YOUR ACTIVITY</p>
            <h2>📊 Practice History</h2>
          </div>
        </div>

        <p className="dashboard-subtitle">
          Review your previous practice attempts and track your progress.
        </p>

        {practiceLoading ? (
          <p className="dashboard-empty-message">
            Loading your practice history...
          </p>
        ) : practiceError ? (
          <p className="dashboard-empty-message">
            {practiceError}
          </p>
        ) : practiceHistory.length === 0 ? (
          <p className="dashboard-empty-message">
            No practice attempts yet. Complete a practice quiz to see your
            results here.
          </p>
        ) : (
          <div className="dashboard-resources">
            {practiceHistory.map((attempt) => (
              <article
                className="dashboard-resource-card"
                key={attempt._id}
              >
                <h3>
                  {conceptNames[attempt.concept] || attempt.concept}
                </h3>

                <p className="dashboard-subtitle">
                  Score: {attempt.score} / {attempt.totalQuestions}
                </p>

                <div className="dashboard-progress-track">
                  <div
                    className="dashboard-progress-fill"
                    style={{ width: `${attempt.percentage}%` }}
                  />
                </div>

                <p className="dashboard-subtitle">
                  Result: {attempt.percentage}%
                </p>

                <small>
                  Attempted: {new Date(attempt.createdAt).toLocaleString()}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="dashboard-footer">
        <span>LearnAdapt AI</span>
        <span>Learn smarter. Grow at your own pace. 💜</span>
      </footer>
    </main>
  );
}

export default Dashboard;
