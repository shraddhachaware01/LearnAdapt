
import learningResources from './engine/resources.js';

const conceptNames = {
  'promise-basics': 'Promise Basics',
  'promise-states': 'Promise States',
  'then-catch': 'Then & Catch',
  'async-await': 'Async / Await',
  'error-handling': 'Error Handling',
};

function Dashboard({ results }) {
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

  // Show all resources before the quiz.
  // After the quiz, show only concepts in the personalized roadmap.
  const filteredResources = Object.entries(learningResources).filter(
    ([concept]) => !results || results.roadmap.includes(concept)
  );

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>LEARNADAPT AI</p>
          <h1 style={styles.heading}>Student Dashboard</h1>
          <p style={styles.subtitle}>
            Understand your progress. Improve at your own pace.
          </p>
        </div>
        <span style={styles.avatar}>🎓</span>
      </header>

      {/* Dashboard statistics */}
      <section style={styles.cards}>
        {stats.map((stat) => (
          <article key={stat.title} style={styles.card}>
            <span style={styles.icon}>{stat.icon}</span>
            <p style={styles.cardTitle}>{stat.title}</p>
            <h2 style={styles.value}>{stat.value}</h2>
            <p style={styles.description}>{stat.description}</p>
          </article>
        ))}
      </section>

      {/* Concept-wise progress */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>JavaScript Learning Progress</h2>
        <p style={styles.subtitle}>
          {results
            ? 'Your actual performance across assessed concepts.'
            : 'Your concept-wise progress will appear after the quiz.'}
        </p>

        {results &&
          Object.entries(results.conceptScores).map(([concept, result]) => {
            const percentage =
              result.total === 0
                ? 0
                : Math.round((result.correct / result.total) * 100);

            const level =
              percentage < 50
                ? 'Needs practice'
                : percentage < 80
                  ? 'Developing'
                  : 'Strong';

            const levelColor =
              percentage < 50
                ? '#c0392b'
                : percentage < 80
                  ? '#9a6700'
                  : '#16803d';

            return (
              <div key={concept} style={styles.concept}>
                <div style={styles.progressHeader}>
                  <strong>{conceptNames[concept] || concept}</strong>
                  <span style={{ color: levelColor }}>
                    {percentage}% · {level}
                  </span>
                </div>

                <div style={styles.track}>
                  <div
                    style={{
                      ...styles.fill,
                      width: `${percentage}%`,
                      background: levelColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </section>

      {/* Personalized roadmap */}
      <section style={styles.recommendation}>
        <span style={styles.recommendationIcon}>🚀</span>
        <div>
          <h2 style={styles.sectionTitle}>Your Next Step</h2>

          {!results ? (
            <p style={styles.subtitle}>
              Complete the JavaScript quiz to receive your personalized
              learning recommendation.
            </p>
          ) : results.roadmap.length > 0 ? (
            <>
              <p style={styles.subtitle}>
                Focus on these concepts in the recommended order:
              </p>
              <ol style={styles.roadmap}>
                {results.roadmap.map((concept) => (
                  <li key={concept}>
                    {conceptNames[concept] || concept}
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p style={styles.subtitle}>
              Excellent work! All assessed concepts are strong. Keep
              practising to maintain your progress.
            </p>
          )}
        </div>
      </section>

      {/* Roadmap-focused learning resources */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>📖 Learning Resources</h2>
        <p style={styles.subtitle}>
          {results
            ? 'Resources selected for your personalized learning roadmap.'
            : 'Complete the quiz to receive resources tailored to your needs.'}
        </p>

        {!results ? (
          <p style={styles.emptyMessage}>
            Your learning resources will be personalized after your quiz.
          </p>
        ) : filteredResources.length > 0 ? (
          filteredResources.map(([concept, resources]) => (
            <div key={concept} style={styles.concept}>
              <h3 style={styles.resourceHeading}>
                {conceptNames[concept] || concept}
              </h3>

              {resources.map((resource) => (
                <p key={resource.url} style={styles.resourceItem}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.resourceLink}
                  >
                    {resource.title} ↗
                  </a>
                  <span style={styles.resourceType}>
                    {' '}· {resource.type}
                  </span>
                </p>
              ))}
            </div>
          ))
        ) : (
          <p style={styles.emptyMessage}>
            🎉 All concepts are strong! No additional resources are needed
            in your current roadmap. You can revisit any concept to keep
            practising.
          </p>
        )}
      </section>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '32px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#172033',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '28px',
  },
  eyebrow: {
    color: '#596bd8',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '2px',
  },
  heading: { fontSize: '30px', margin: '10px 0' },
  subtitle: { color: '#667085', lineHeight: 1.6, fontSize: '14px' },
  avatar: {
    fontSize: '30px',
    background: '#edf1ff',
    padding: '16px',
    borderRadius: '16px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e4e7ec',
    borderRadius: '16px',
    padding: '22px',
    marginBottom: '20px',
    boxShadow: '0 4px 18px rgba(16, 24, 40, 0.04)',
  },
  icon: { fontSize: '25px' },
  cardTitle: { color: '#667085', fontSize: '14px' },
  value: { fontSize: '32px', margin: '8px 0' },
  description: { color: '#667085', fontSize: '13px', lineHeight: 1.5 },
  sectionTitle: { fontSize: '20px', marginTop: 0 },
  concept: { marginTop: '22px' },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    fontSize: '14px',
    marginBottom: '9px',
  },
  track: {
    height: '9px',
    background: '#eaecf0',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    background: '#596bd8',
    borderRadius: '20px',
  },
  recommendation: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '22px',
    borderRadius: '16px',
    background: '#f3f6ff',
    marginTop: '4px',
    marginBottom: '20px',
  },
  recommendationIcon: { fontSize: '26px' },
  roadmap: {
    paddingLeft: '22px',
    lineHeight: 2,
    fontSize: '14px',
    fontWeight: '600',
  },
  resourceHeading: {
    fontSize: '16px',
    marginBottom: '8px',
  },
  resourceItem: {
    lineHeight: 1.6,
    margin: '8px 0',
  },
  resourceLink: {
    color: '#596bd8',
    fontWeight: '600',
    textDecoration: 'none',
  },
  resourceType: {
    color: '#667085',
    fontSize: '13px',
  },
  emptyMessage: {
    color: '#667085',
    fontSize: '14px',
    lineHeight: 1.7,
    marginTop: '18px',
  },
};

export default Dashboard;
