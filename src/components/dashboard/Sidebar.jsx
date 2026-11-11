
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '⌂', end: true },
  { label: 'My Learning', path: '/learn', icon: '▤', end: true },
  { label: 'AI Insights', path: '/dashboard#ai-insights', icon: '✧' },
  { label: 'Learning Roadmap', path: '/dashboard#roadmap', icon: '⌁' },
  { label: 'Learning Materials', path: '/materials', icon: '▣', end: true },
  { label: 'Videos', path: '/videos', icon: '▷', end: true },
  { label: 'My Notes', path: '/notes', icon: '✎', end: true },
  { label: 'Practice', path: '/learn/practice', icon: '✏', end: true },
  { label: 'My Progress', path: '/dashboard#progress' },
];

function Sidebar() {
  const location = useLocation();

  const isItemActive = (item) => {
    if (item.path.includes('#')) {
      const [pathname, hash] = item.path.split('#');
      return location.pathname === pathname && location.hash === `#${hash}`;
    }

    if (item.path === '/dashboard') {
      return location.pathname === '/dashboard' && !location.hash;
    }

   if (item.path === '/notes') {
  return (
    location.pathname === '/notes' ||
    location.pathname.startsWith('/notes/')
  );
}

return location.pathname === item.path;
  };

  const renderLink = (item) => (
    <NavLink
      key={item.label}
      to={item.path}
      end={item.end || false}
      className={`sidebar-link ${isItemActive(item) ? 'active' : ''}`}
    >
      <span className="sidebar-link-icon">{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <aside className="learn-sidebar">

      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">L</div>
        <div>
          <h2>LearnAdapt</h2>
          <span>AI Learning Platform</span>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <div className="sidebar-menu">
        <p className="sidebar-label">MAIN MENU</p>

        {navigationItems.map(renderLink)}
      </div>

      {/* ACCOUNT */}
      <div className="sidebar-account">
        <p className="sidebar-label">ACCOUNT</p>

        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-link-icon">◉</span>
          <span>My Profile</span>
        </NavLink>
      </div>

      {/* BOTTOM CARD */}
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
