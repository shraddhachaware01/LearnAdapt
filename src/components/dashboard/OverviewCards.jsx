
import './OverviewCards.css';

function OverviewCards({ stats = [] }) {
  return (
    <section className="overview-section" aria-label="Learning overview">
      <div className="overview-heading">
        <div>
          <span className="overview-eyebrow">YOUR LEARNING AT A GLANCE</span>
          <h2>Learning Overview</h2>
        </div>
        <span className="overview-heading-tag">Performance Summary</span>
      </div>

      <div className="overview-grid">
        {stats.map((stat, index) => (
          <article className="overview-card" key={stat.title}>
            <div className="overview-card-top">
              <span className={`overview-icon overview-icon-${index % 4}`}>
                {stat.icon}
              </span>
              <span className="overview-card-decoration" aria-hidden="true" />
            </div>

            <p className="overview-card-label">{stat.title}</p>
            <h3 className="overview-card-value">{stat.value}</h3>
            <p className="overview-card-description">
              {stat.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OverviewCards;
