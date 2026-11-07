import './AIInsights.css';

function AIInsights({
  strongConcepts = [],
  developingConcepts = [],
  weakConcepts = [],
  conceptAnalysis = {},
}) {
  const insightGroups = [
    {
      title: 'Strong Concepts',
      subtitle: 'You are doing great here!',
      concepts: strongConcepts,
      type: 'strong',
      icon: '✦',
    },
    {
      title: 'Developing Concepts',
      subtitle: 'Keep practicing to improve.',
      concepts: developingConcepts,
      type: 'developing',
      icon: '↗',
    },
    {
      title: 'Needs Practice',
      subtitle: 'Focus on these concepts next.',
      concepts: weakConcepts,
      type: 'weak',
      icon: '◎',
    },
  ];

  return (
    <section className="ai-insights-section" id="ai-insights">
      <div className="ai-insights-heading">
        <div>
          <span className="ai-insights-eyebrow">PERSONALIZED ANALYSIS</span>
          <h2>AI Learning Insights</h2>
          <p>Understand your performance and discover what to learn next.</p>
        </div>
        <span className="ai-insights-badge">✧ AI Powered</span>
      </div>

      <div className="ai-insights-grid">
        {insightGroups.map((group) => (
          <article
            className={`ai-insight-card ${group.type}`}
            key={group.type}
          >
            <div className="ai-insight-card-heading">
              <span className="ai-insight-icon">{group.icon}</span>
              <div>
                <h3>{group.title}</h3>
                <p>{group.subtitle}</p>
              </div>
            </div>

            {group.concepts.length > 0 ? (
              <div className="ai-insight-concepts">
                {group.concepts.map((concept) => {
                  const details = conceptAnalysis[concept] || {};
                  const rawPercentage =
                    details.percentage ?? details.score ?? null;
                  const percentage =
                    rawPercentage !== null &&
                    rawPercentage !== undefined &&
                    Number.isFinite(Number(rawPercentage))
                      ? Math.min(100, Math.max(0, Number(rawPercentage)))
                      : null;

                  return (
                    <div className="ai-insight-concept" key={concept}>
                      <div className="ai-insight-concept-info">
                        <span>{concept}</span>
                        {percentage !== null && (
                          <strong>{Math.round(percentage)}%</strong>
                        )}
                      </div>

                      {percentage !== null && (
                        <div
                          className="ai-insight-progress"
                          role="progressbar"
                          aria-valuenow={Math.round(percentage)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${concept} progress`}
                        >
                          <div
                            className="ai-insight-progress-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="ai-insight-empty">
                No concepts in this category yet.
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default AIInsights;