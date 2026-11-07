
import './DashboardHeader.css';

function DashboardHeader() {
  return (
    <header className="dashboard-welcome">
      <div className="welcome-content">
        <span className="welcome-label">
          YOUR PERSONAL LEARNING SPACE
        </span>

        <h1>
          Welcome back, Student! <span>👋</span>
        </h1>

        <p>
          Every step forward brings you closer to your learning goals.
          Let's make today productive!
        </p>
      </div>

      <div className="welcome-profile">
        <div className="profile-avatar">
          S
        </div>

        <div className="profile-details">
          <strong>Student</strong>
          <span>Learning Enthusiast</span>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
