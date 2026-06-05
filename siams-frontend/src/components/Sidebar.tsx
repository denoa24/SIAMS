import { NavLink } from 'react-router-dom';
import logo from '../assets/siams-logo.png';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/vehicles', label: 'Vehicles', icon: '🚗' },
  { path: '/access-requests', label: 'Access Requests', icon: '🔐' },
  { path: '/security-alerts', label: 'Security Alerts', icon: '🛡️' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
  { path: '/architecture', label: 'Architecture', icon: '🧩' },
  { path: '/live-map', label: 'Live Map', icon: '🗺️' },
  { path: '/rsu-monitoring', label: 'RSU Monitoring', icon: '📡' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-wrapper">
          <img src={logo} alt="SIAMS Logo" className="sidebar-logo-image" />
        </div>

        <div className="sidebar-brand-text">
          <h1>SIAMS</h1>
          <p>Secure Intelligent Access Management System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-status-card">
        <div className="status-card-top">
          <span className="status-pulse"></span>
          <strong>System Online</strong>
        </div>

        <p>V2I monitoring active</p>
      </div>
    </aside>
  );
}