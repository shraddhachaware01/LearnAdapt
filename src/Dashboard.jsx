
function Dashboard() {
  const stats = [
    {
      title: 'Overall Score',
      value: '80%',
      description: 'Your latest quiz performance',
      icon: '🎯'
    },
    {
      title: 'Strong Concepts',
      value: '3',
      description: 'Concepts you understand well',
      icon: '💪'
    },
    {
      title: 'Needs Practice',
      value: '2',
      description: 'Concepts to improve',
      icon: '📚'
    }
  ];

  const concepts = [
    { name: 'Promise Basics', progress: 100 },
    { name: 'Promise States', progress: 33 },
    { name: 'Then & Catch', progress: 67 },
    { name: 'Async / Await', progress: 100 },
    { name: 'Error Handling', progress: 100 }
  ];

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

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>JavaScript Learning Progress</h2>
        <p style={styles.subtitle}>
          Your performance across the five assessed concepts.
        </p>

        {concepts.map((concept) => (
          <div key={concept.name} style={styles.concept}>
            <div style={styles.progressHeader}>
              <strong>{concept.name}</strong>
              <span>{concept.progress}%</span>
            </div>

            <div style={styles.track}>
              <div
                style={{
                  ...styles.fill,
                  width: `${concept.progress}%`
                }}
              />
            </div>
          </div>
        ))}
      </section>

      <section style={styles.recommendation}>
        <span style={styles.recommendationIcon}>🚀</span>
        <div>
          <h2 style={styles.sectionTitle}>Your Next Step</h2>
          <p style={styles.subtitle}>
            Review Promise States, then practise Then & Catch.
            Strengthen the fundamentals before moving ahead.
          </p>
        </div>
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
    color: '#172033'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '28px'
  },
  eyebrow: {
    color: '#596bd8',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '2px'
  },
  heading: { fontSize: '30px', margin: '10px 0' },
  subtitle: { color: '#667085', lineHeight: 1.6, fontSize: '14px' },
  avatar: {
    fontSize: '30px',
    background: '#edf1ff',
    padding: '16px',
    borderRadius: '16px'
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e4e7ec',
    borderRadius: '16px',
    padding: '22px',
    marginBottom: '20px',
    boxShadow: '0 4px 18px rgba(16, 24, 40, 0.04)'
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
    marginBottom: '9px'
  },
  track: {
    height: '9px',
    background: '#eaecf0',
    borderRadius: '20px',
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    background: '#596bd8',
    borderRadius: '20px'
  },
  recommendation: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '22px',
    borderRadius: '16px',
    background: '#f3f6ff',
    marginTop: '4px'
  },
  recommendationIcon: { fontSize: '26px' }
};

export default Dashboard;
