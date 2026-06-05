import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h1 className="logo-title">SIAMS</h1>
        <p className="logo-subtitle">
          Secure Intelligent Access Management System
        </p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-button">
          Dashboard
        </NavLink>

        <NavLink to="/vehicles" className="nav-button">
          Vehicles
        </NavLink>

        <NavLink to="/access-requests" className="nav-button">
          Access Requests
        </NavLink>

        <NavLink to="/security-alerts" className="nav-button">
          Security Alerts
        </NavLink>

        <NavLink to="/analytics" className="nav-button">
          Analytics
        </NavLink>

        <NavLink to="/architecture" className="nav-button">
          Architecture
        </NavLink>

        <NavLink to="/live-map" className="nav-button">
          Live Map
        </NavLink>

        <NavLink to="/rsu-monitoring" className="nav-button">
          RSU Monitoring
        </NavLink>
      </nav>

      <div className="system-status">
        <p className="stat-title">System Status</p>

        <div className="status-row">
          <div className="status-dot"></div>
          <span>Operational</span>
        </div>
      </div>
    </aside>
  );
}