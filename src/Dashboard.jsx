
import AIInsights from './components/dashboard/AIInsights';
import OverviewCards from './components/dashboard/OverviewCards';
import DashboardHeader from './components/dashboard/DashboardHeader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import learningResources from './engine/resources.js';
import DashboardLayout from './components/dashboard/DashboardLayout';
import './Dashboard.css';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001';

const conceptNames = {
  'promise-basics': 'Promise Basics',
  'promise-states': 'Promise States',
  'then-catch': 'Then & Catch',
  'async-await': 'Async / Await',
  'error-handling': 'Error Handling',
};

function getConceptLevel(result = {}) {
  if (typeof result.level === 'string') {
    const level = result.level.toLowerCase();

    if (level.includes('strong')) return 'Strong';
    if (level.includes('develop')) return 'Developing';

    if (level.includes('practice') || level.includes('weak')) {
      return 'Needs Practice';
    }
  }

  const total = Number(result.total);
  const correct = Number(result.correct) || 0;

  const percentage =
    total > 0 ? Math.round((correct / total) * 100) : 0;

  if (percentage >= 80) return 'Strong';
  if (percentage < 50) return 'Needs Practice';

  return 'Developing';
}

function getConceptPercentage(result = {}) {
  if (typeof result.percentage === 'number') {
    return Math.round(result.percentage);
  }

  const total = Number(result.total);
  const correct = Number(result.correct) || 0;

  return total > 0
    ? Math.round((correct / total) * 100)
    : 0;
}

function Dashboard({ results, quizHistory = [] }) {
  const navigate = useNavigate();

  const [practiceHistory, setPracticeHistory] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(true);
  const [practiceError, setPracticeError] = useState('');

  // Diagnostic quiz data
  const conceptScores = results?.conceptScores || {};
  const roadmap = results?.roadmap || [];
  const aiAnalysis = results?.aiAnalysis || {};

  // Prepare concept-wise diagnostic results
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

  // AI Insights concept names
  const aiStrongConceptNames =
    Array.isArray(aiAnalysis.strong_concepts) &&
    aiAnalysis.strong_concepts.length > 0
      ? aiAnalysis.strong_concepts.map(
          (concept) => conceptNames[concept] || concept
        )
      : strongConcepts.map((concept) => concept.name);

  const aiDevelopingConceptNames =
    Array.isArray(aiAnalysis.developing_concepts) &&
    aiAnalysis.developing_concepts.length > 0
      ? aiAnalysis.developing_concepts.map(
          (concept) => conceptNames[concept] || concept
        )
      : developingConcepts.map((concept) => concept.name);

  const aiWeakConceptNames =
    Array.isArray(aiAnalysis.weak_concepts) &&
    aiAnalysis.weak_concepts.length > 0
      ? aiAnalysis.weak_concepts.map(
          (concept) => conceptNames[concept] || concept
        )
      : weakConcepts.map((concept) => concept.name);

  // Prepare AI concept analysis
  const conceptAnalysis = Object.fromEntries(
    Object.entries(aiAnalysis.concept_analysis || {}).map(
      ([key, value]) => [
        conceptNames[key] || key,
        value,
      ]
    )
  );

  analyzedConcepts.forEach((concept) => {
    conceptAnalysis[concept.name] =
      conceptAnalysis[concept.name] || {
        percentage: concept.percentage,
        level: concept.level,
      };
  });

  // Fetch practice history from MongoDB
  useEffect(() => {
    let cancelled = false;

    async function fetchPracticeHistory() {
      try {
        setPracticeLoading(true);
        setPracticeError('');

        const response = await fetch(
          `${API_BASE_URL}/api/practice-results`
        );

        if (!response.ok) {
          throw new Error('Could not load practice history.');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error('Could not load practice history.');
        }

        if (!cancelled) {
          setPracticeHistory(
            Array.isArray(data.data) ? data.data : []
          );
        }
      } catch (error) {
        if (!cancelled) {
          setPracticeError(
            error.message || 'Could not load practice history.'
          );
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

  // Calculate statistics from saved practice attempts
  const practiceSummary = practiceHistory.reduce(
    (summary, attempt) => {
      const score = Number(attempt.score);
      const total = Number(attempt.totalQuestions);

      if (
        !Number.isFinite(score) ||
        !Number.isFinite(total) ||
        total <= 0
      ) {
        return summary;
      }

      summary.correct += score;
      summary.total += total;

      const concept = attempt.concept;

      if (concept) {
        if (!summary.concepts[concept]) {
          summary.concepts[concept] = {
            correct: 0,
            total: 0,
          };
        }

        summary.concepts[concept].correct += score;
        summary.concepts[concept].total += total;
      }

      return summary;
    },
    {
      correct: 0,
      total: 0,
      concepts: {},
    }
  );

  // Classify unique concepts using their combined practice results
  const practiceConcepts = Object.values(
    practiceSummary.concepts
  );

  const practiceStrongCount = practiceConcepts.filter(
    (concept) =>
      (concept.correct / concept.total) * 100 >= 80
  ).length;

  const practiceWeakCount = practiceConcepts.filter(
    (concept) =>
      (concept.correct / concept.total) * 100 < 50
  ).length;

  const practiceOverallPercentage =
    practiceSummary.total > 0
      ? Math.round(
          (practiceSummary.correct / practiceSummary.total) * 100
        )
      : null;

  // Learning Overview Cards
  const hasQuizResults = Boolean(results);

  const stats = [
    {
      title: 'Overall Score',
      value:
        hasQuizResults &&
        typeof results.overallPercentage === 'number'
          ? `${results.overallPercentage}%`
          : practiceOverallPercentage !== null
            ? `${practiceOverallPercentage}%`
            : '—',

      description: hasQuizResults
        ? `${results.score ?? 0} of ${results.totalQuestions ?? 0} questions correct`
        : practiceSummary.total > 0
          ? `${practiceSummary.correct} of ${practiceSummary.total} practice questions correct`
          : 'Complete a quiz to see your score',

      icon: '🎯',
    },
    {
      title: 'Strong Concepts',

      value: hasQuizResults
        ? strongConcepts.length
        : practiceStrongCount,

      description: 'Concepts you understand well',
      icon: '💪',
    },
    {
      title: 'Needs Practice',

      value: hasQuizResults
        ? weakConcepts.length
        : practiceWeakCount,

      description: 'Concepts to improve',
      icon: '📚',
    },
    {
      title: 'Quizzes Taken',

      value:
        (Array.isArray(quizHistory) ? quizHistory.length : 0) +
        practiceHistory.length,

      description: 'Diagnostic and practice attempts',
      icon: '📝',
    },
  ];

  // Filter learning resources
  const filteredResources = Object.entries(
    learningResources
  ).filter(
    ([concept]) => !results || roadmap.includes(concept)
  );

  // Navigate to practice page
  const startPractice = (concept) => {
    navigate(
      `/learn/practice?concept=${encodeURIComponent(concept)}`
    );
  };

  return (
    <DashboardLayout>
      <main className="dashboard-page">

        {/* Dashboard Header */}
        <DashboardHeader />

        {/* Learning Overview */}
        <OverviewCards stats={stats} />

        {/* AI Learning Insights */}
        <AIInsights
          strongConcepts={aiStrongConceptNames}
          developingConcepts={aiDevelopingConceptNames}
          weakConcepts={aiWeakConceptNames}
          conceptAnalysis={conceptAnalysis}
        />

        {/* Learning Progress */}
        <section
          className="dashboard-panel"
          id="progress"
        >
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-eyebrow">
                YOUR PERFORMANCE
              </p>
              <h2>JavaScript Learning Progress</h2>
            </div>

            <span className="dashboard-heading-icon">
              📈
            </span>
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
              <div
                className="dashboard-concept"
                key={concept.id}
              >
                <div className="dashboard-progress-header">
                  <strong>{concept.name}</strong>

                  <span
                    className={`dashboard-level ${levelClass}`}
                  >
                    {concept.level}
                  </span>
                </div>

                <div className="dashboard-progress-track">
                  <div
                    className={`dashboard-progress-fill ${levelClass}`}
                    style={{
                      width: `${concept.percentage}%`,
                    }}
                  />
                </div>

                <p className="dashboard-concept-detail">
                  {concept.result.correct} of{' '}
                  {concept.result.total} correct
                  {' · '}
                  {concept.percentage}%
                </p>
              </div>
            );
          })}
        </section>

        {/* Personalized Learning Roadmap */}
        <section
          className="dashboard-panel"
          id="roadmap"
        >
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-eyebrow">
                YOUR NEXT STEPS
              </p>

              <h2>Your Personalized Learning Roadmap</h2>
            </div>
          </div>

          {!results ? (
            <p className="dashboard-subtitle">
              Complete the JavaScript quiz to receive
              personalized learning recommendations.
            </p>
          ) : roadmap.length > 0 ? (
            <>
              <p className="dashboard-subtitle">
                Follow these concepts in the recommended
                learning order:
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

                        <p className="dashboard-concept-detail">
                          Priority: {level}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => startPractice(concept)}
                      >
                        Practice
                      </button>
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <p className="dashboard-subtitle">
              Excellent work! All assessed concepts are strong.
              Keep practicing to maintain your progress.
            </p>
          )}
        </section>

        {/* Recommended Learning Resources */}
        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-eyebrow">
                KEEP LEARNING
              </p>

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
              Your learning resources will be personalized
              after your quiz.
            </p>
          ) : filteredResources.length > 0 ? (
            <div className="dashboard-resources">
              {filteredResources.map(([concept, resources]) => (
                <article
                  className="dashboard-resource-card"
                  key={concept}
                >
                  <h3>
                    {conceptNames[concept] || concept}
                  </h3>

                  {resources.map((resource) => (
                    <a
                      className="dashboard-resource-link"
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{resource.title}</span>

                      <span aria-hidden="true">
                        ↗
                      </span>

                      <small>{resource.type}</small>
                    </a>
                  ))}
                </article>
              ))}
            </div>
          ) : (
            <p className="dashboard-empty-message">
              🎉 All concepts are strong! Revisit any concept
              to keep practicing.
            </p>
          )}
        </section>

        {/* Practice Section */}
        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-eyebrow">
                TEST YOUR KNOWLEDGE
              </p>

              <h2>Practice JavaScript Concepts</h2>
            </div>

            <span className="dashboard-heading-icon">
              ✍️
            </span>
          </div>

          <p className="dashboard-subtitle">
            Choose any concept and practice what you have learned.
          </p>

          <div className="dashboard-resources">
            {Object.entries(conceptNames).map(
              ([concept, name]) => (
                <article
                  className="dashboard-resource-card"
                  key={concept}
                >
                  <h3>{name}</h3>

                  <p className="dashboard-subtitle">
                    Test your understanding with practice questions.
                  </p>

                  <button
                    type="button"
                    onClick={() => startPractice(concept)}
                  >
                    Start Practice →
                  </button>
                </article>
              )
            )}
          </div>
        </section>

        {/* Practice History */}
        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-eyebrow">
                YOUR ACTIVITY
              </p>

              <h2>📊 Practice History</h2>
            </div>
          </div>

          <p className="dashboard-subtitle">
            Review your previous practice attempts and track
            your progress.
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
              No practice attempts yet. Complete a practice
              quiz to see your results here.
            </p>
          ) : (
            <div className="dashboard-resources">
              {practiceHistory.map((attempt) => (
                <article
                  className="dashboard-resource-card"
                  key={attempt._id}
                >
                  <h3>
                    {conceptNames[attempt.concept] ||
                      attempt.concept}
                  </h3>

                  <p className="dashboard-subtitle">
                    Score: {attempt.score} /{' '}
                    {attempt.totalQuestions}
                  </p>

                  <div className="dashboard-progress-track">
                    <div
                      className="dashboard-progress-fill"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            Number(attempt.percentage) || 0
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="dashboard-subtitle">
                    Result: {attempt.percentage}%
                  </p>

                  <small>
                    Attempted:{' '}
                    {new Date(
                      attempt.createdAt
                    ).toLocaleString()}
                  </small>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="dashboard-footer">
          <span>LearnAdapt AI</span>

          <span>
            Learn smarter. Grow at your own pace. 💜
          </span>
        </footer>

      </main>
    </DashboardLayout>
  );
}

export default Dashboard;
