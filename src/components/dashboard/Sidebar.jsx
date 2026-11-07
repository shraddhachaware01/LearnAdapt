
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '⌂', end: true },
  { label: 'My Learning', path: '/learn', icon: '▤' },
  { label: 'AI Insights', path: '/dashboard#ai-insights', icon: '✧' },
  { label: 'Learning Roadmap', path: '/dashboard#roadmap', icon: '⌁' },
  { label: 'Practice', path: '/learn/practice', icon: '✎' },
  { label: 'My Progress', path: '/dashboard#progress', icon: '▥' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="learn-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">L</div>
        <div>
          <h2>LearnAdapt</h2>
          <span>AI Learning Platform</span>
        </div>
      </div>

      <div className="sidebar-menu">
        <p className="sidebar-label">MAIN MENU</p>

        {navigationItems.map((item) => {
          const isSectionActive =
            item.path.includes('#') &&
            location.pathname === '/dashboard' &&
            location.hash === item.path.split('#')[1];

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive || isSectionActive ? 'active' : ''
                }`
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-help">
          <span>💜</span>
          <p>Keep learning. Keep growing.</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
