
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

function getConceptLevel(result) {
  if (result.level) {
    const level = result.level.toLowerCase();

    if (level.includes('strong')) return 'Strong';
    if (level.includes('develop')) return 'Developing';
    if (level.includes('practice') || level.includes('weak')) {
      return 'Needs Practice';
    }
  }

  const percentage =
    result.total > 0
      ? Math.round((result.correct / result.total) * 100)
      : 0;

  if (percentage >= 80) return 'Strong';
  if (percentage < 50) return 'Needs Practice';
  return 'Developing';
}

function getConceptPercentage(result) {
  if (typeof result.percentage === 'number') {
    return Math.round(result.percentage);
  }

  return result.total > 0
    ? Math.round((result.correct / result.total) * 100)
    : 0;
}

function Dashboard({ results }) {
  const navigate = useNavigate();

  const [practiceHistory, setPracticeHistory] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(true);
  const [practiceError, setPracticeError] = useState('');

  const conceptScores = results?.conceptScores || {};
  const roadmap = results?.roadmap || [];

  const analyzedConcepts = Object.entries(conceptScores).map(
    ([concept, result]) => ({
      id: concept,
      name: conceptNames[concept] || concept,
      result,
      percentage: getConceptPercentage(result),
      level: getConceptLevel(result),
    })
  );

  const strongConcepts = analyzedConcepts.filter(
    (concept) => concept.level === 'Strong'
  );

  const developingConcepts = analyzedConcepts.filter(
    (concept) => concept.level === 'Developing'
  );

  const weakConcepts = analyzedConcepts.filter(
    (concept) => concept.level === 'Needs Practice'
  );

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
      value: results ? strongConcepts.length : '—',
      description: 'Concepts you understand well',
      icon: '💪',
    },
    {
      title: 'Needs Practice',
      value: results ? weakConcepts.length : '—',
      description: 'Concepts to improve',
      icon: '📚',
    },
  ];

  const filteredResources = Object.entries(learningResources).filter(
    ([concept]) => !results || roadmap.includes(concept)
  );

  const startPractice = (concept) => {
    navigate(
      `/learn/practice?concept=${encodeURIComponent(concept)}`
    );
  };

  const getFeedback = (concept) => {
    if (concept.level === 'Strong') {
      return 'You have a good understanding of this concept. Keep practicing to maintain your knowledge.';
    }

    if (concept.level === 'Developing') {
      return 'You understand some parts of this concept. Review the topic and solve more practice questions.';
    }

    return 'This concept needs more attention. Start with the recommended learning resources and practice the basics.';
  };

  const categoryStyle = {
    Strong: {
      color: '#15803d',
      background: '#dcfce7',
      border: '#86efac',
    },
    Developing: {
      color: '#a16207',
      background: '#fef3c7',
      border: '#fcd34d',
    },
    'Needs Practice': {
      color: '#b91c1c',
      background: '#fee2e2',
      border: '#fca5a5',
    },
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

      {/* Personalized AI Learning Insights */}
      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">PERSONALIZED ANALYSIS</p>
            <h2>🤖 Your AI Learning Insights</h2>
          </div>
        </div>

        {!results ? (
          <p className="dashboard-subtitle">
            Complete the diagnostic quiz to receive your personalized
            learning analysis.
          </p>
        ) : (
          <>
            <p className="dashboard-subtitle">
              Your quiz performance has been analyzed to identify
              your learning strengths and areas for improvement.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '16px',
                marginTop: '24px',
              }}
            >
              {[
                {
                  title: 'Strong Concepts',
                  concepts: strongConcepts,
                  color: '#15803d',
                  background: '#f0fdf4',
                  icon: '💪',
                },
                {
                  title: 'Developing Concepts',
                  concepts: developingConcepts,
                  color: '#a16207',
                  background: '#fffbeb',
                  icon: '📈',
                },
                {
                  title: 'Needs Practice',
                  concepts: weakConcepts,
                  color: '#b91c1c',
                  background: '#fef2f2',
                  icon: '🎯',
                },
              ].map((group) => (
                <article
                  key={group.title}
                  style={{
                    background: group.background,
                    borderRadius: '14px',
                    padding: '18px',
                    border: `1px solid ${group.color}30`,
                  }}
                >
                  <h3 style={{ color: group.color, marginTop: 0 }}>
                    {group.icon} {group.title}
                  </h3>

                  <h2 style={{ color: group.color, fontSize: '30px' }}>
                    {group.concepts.length}
                  </h2>

                  {group.concepts.length > 0 ? (
                    <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
                      {group.concepts.map((concept) => (
                        <li key={concept.id}>{concept.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No concepts in this category.</p>
                  )}
                </article>
              ))}
            </div>

            <div style={{ marginTop: '28px' }}>
              <h3>💡 Personalized Feedback</h3>

              {weakConcepts.length > 0 ? (
                <p className="dashboard-subtitle">
                  Your first priority should be{' '}
                  <strong>
                    {weakConcepts.map((concept) => concept.name).join(', ')}
                  </strong>
                  . These concepts had accuracy below 50%. Review their
                  learning materials and practice them again.
                </p>
              ) : developingConcepts.length > 0 ? (
                <p className="dashboard-subtitle">
                  You have no concepts below 50%. Focus next on{' '}
                  <strong>
                    {developingConcepts.map((concept) => concept.name).join(', ')}
                  </strong>{' '}
                  to strengthen your understanding.
                </p>
              ) : (
                <p className="dashboard-subtitle">
                  Excellent work! All assessed concepts are strong.
                  Continue practicing to maintain your performance.
                </p>
              )}
            </div>

            <p
              className="dashboard-subtitle"
              style={{ fontSize: '12px', marginTop: '18px' }}
            >
              Analysis is based on your quiz accuracy: Strong (80% or above),
              Developing (50–79%), and Needs Practice (below 50%).
            </p>
          </>
        )}
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

        {analyzedConcepts.map((concept) => {
          const levelClass =
            concept.level === 'Strong'
              ? 'strong'
              : concept.level === 'Developing'
              ? 'medium'
              : 'weak';

          return (
            <div className="dashboard-concept" key={concept.id}>
              <div className="dashboard-concept-heading">
                <strong>{concept.name}</strong>
                <span className={`dashboard-level ${levelClass}`}>
                  {concept.level}
                </span>
              </div>

              <div className="dashboard-progress-track">
                <div
                  className={`dashboard-progress-fill ${levelClass}`}
                  style={{ width: `${concept.percentage}%` }}
                />
              </div>

              <p className="dashboard-subtitle">
                {concept.result.correct} of {concept.result.total} correct
                {' · '}{concept.percentage}%
              </p>
            </div>
          );
        })}
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
        ) : roadmap.length > 0 ? (
          <>
            <p className="dashboard-subtitle">
              Follow these concepts in the recommended learning order:
            </p>

            <ol className="dashboard-roadmap-list">
              {roadmap.map((concept, index) => {
                const conceptResult = conceptScores[concept];
                const level = conceptResult
                  ? getConceptLevel(conceptResult)
                  : 'Developing';

                return (
                  <li key={concept}>
                    <span className="dashboard-roadmap-number">
                      {index + 1}
                    </span>
                    <div>
                      <strong>
                        {conceptNames[concept] || concept}
                      </strong>
                      <p className="dashboard-subtitle">
                        Priority: {level}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        ) : (
          <p className="dashboard-subtitle">
            Excellent work! All assessed concepts are strong. Keep
            practicing to maintain your progress.
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
            practicing.
          </p>
        )}
      </section>

      {/* Practice Quiz Access */}
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
