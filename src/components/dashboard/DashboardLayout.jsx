
import Sidebar from './Sidebar';
import './DashboardLayout.css';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
