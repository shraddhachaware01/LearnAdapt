
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <header className="home-navbar">
        <Link to="/" className="home-logo">
          LearnAdapt<span> AI</span>
        </Link>

        <nav className="home-nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/learn/practice">Practice</Link>
          <Link to="/quiz" className="home-nav-button">
            Start Learning
          </Link>
        </nav>
      </header>

      <main className="home-hero">
        <div className="home-badge">
          Your personal AI learning companion
        </div>

        <h1>
          Learn smarter.
          <br />
          <span>Grow at your own pace.</span>
        </h1>

        <p className="home-description">
          Discover your strengths, understand your weak concepts,
          and follow a personalized learning roadmap designed
          around your needs.
        </p>

        <div className="home-actions">
          <Link to="/quiz" className="home-primary-button">
            Take Your First Quiz →
          </Link>

          <Link to="/dashboard" className="home-secondary-button">
            Explore Dashboard
          </Link>

          <Link to="/learn/practice" className="home-secondary-button">
            Start Practice →
          </Link>
        </div>

        <div className="home-features">

          <Link to="/quiz" className="home-feature">
            <span className="home-feature-icon">🎯</span>
            <h3>Find Your Level</h3>
            <p>Discover what you know and where you need help.</p>
            <span>Take Diagnostic Quiz →</span>
          </Link>

          <Link to="/dashboard" className="home-feature">
            <span className="home-feature-icon">🗺️</span>
            <h3>Personalized Roadmap</h3>
            <p>Learn concepts in an order that works for you.</p>
            <span>View Your Roadmap →</span>
          </Link>

          <Link to="/dashboard" className="home-feature">
            <span className="home-feature-icon">📈</span>
            <h3>Track Your Progress</h3>
            <p>Review your performance as you learn.</p>
            <span>View Your Progress →</span>
          </Link>

        </div>
      </main>

      <footer className="home-footer">
        LearnAdapt AI · Learn Smarter. Learn Your Way.
      </footer>
    </div>
  );
}

export default Home;
