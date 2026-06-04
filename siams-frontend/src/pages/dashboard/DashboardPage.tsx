import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/api';
import './DashboardPage.css';

type DashboardStats = {
  connectedVehicles: number;
  authenticatedVehicles: number;
  deniedRequests: number;
  activeRSUs: number;
};

type ActivityLog = {
  id: number;
  vehicleId: string;
  rsuId: string;
  status: 'Granted' | 'Denied' | 'Pending';
  timestamp: string;
  reason: string;
};

type SecurityAlert = {
  id: number;
  title: string;
  vehicleId: string;
  rsuId: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  description: string;
};

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);

  const loadDashboardData = async () => {
    const statsResponse = await api.get('/dashboard/stats');
    setStats(statsResponse.data);

    const activityResponse = await api.get('/dashboard/activity');
    setActivityLogs(activityResponse.data);

    const alertsResponse = await api.get('/dashboard/alerts');
    setSecurityAlerts(alertsResponse.data);
  };

  const simulateAccess = async () => {
    await api.post('/access-requests/simulate');
    await loadDashboardData();
  };

  useEffect(() => {
    api.get('/dashboard/stats').then((statsResponse) => {
      setStats(statsResponse.data);
    });

    api.get('/dashboard/activity').then((activityResponse) => {
      setActivityLogs(activityResponse.data);
    });

    api.get('/security-alerts').then((alertsResponse) => {
      setSecurityAlerts(alertsResponse.data.slice(0, 2));
    });
  }, []);

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h2 className="page-title">SIAMS Dashboard</h2>
            <p className="page-subtitle">
              Real-time connected vehicle monitoring and authentication.
            </p>
          </div>

          <div className="search-section">
            <input
              type="text"
              placeholder="Search vehicle..."
              className="search-input"
            />

            <button className="search-button">Search</button>
          </div>
        </div>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <p className="stat-title">Connected Vehicles</p>
              <span className="stat-badge">Online</span>
            </div>
            <h3 className="stat-value">
              {stats ? stats.connectedVehicles : 'Loading...'}
            </h3>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <p className="stat-title">Authenticated Vehicles</p>
              <span className="stat-badge">Secure</span>
            </div>
            <h3 className="stat-value">
              {stats ? stats.authenticatedVehicles : 'Loading...'}
            </h3>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <p className="stat-title">Denied Access Attempts</p>
              <span className="stat-badge">Warning</span>
            </div>
            <h3 className="stat-value">
              {stats ? stats.deniedRequests : 'Loading...'}
            </h3>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <p className="stat-title">Active RSUs</p>
              <span className="stat-badge">Operational</span>
            </div>
            <h3 className="stat-value">
              {stats ? stats.activeRSUs : 'Loading...'}
            </h3>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="activity-panel">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Live Vehicle Activity</h3>
                <p className="panel-subtitle">
                  Real-time authentication requests.
                </p>
              </div>

              <button className="search-button" onClick={simulateAccess}>
                Simulate Access
              </button>
            </div>

            <div className="table-container">
              <table className="activity-table">
                <thead className="table-header">
                  <tr>
                    <th>Vehicle ID</th>
                    <th>RSU</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>

                <tbody>
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="table-row">
                      <td>{log.vehicleId}</td>
                      <td>{log.rsuId}</td>

                      <td>
                        <span className={`status-badge ${log.status.toLowerCase()}`}>
                          {log.status}
                        </span>
                      </td>

                      <td>{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="right-panels">
            <div className="panel-card">
              <h3 className="panel-title">Security Alerts</h3>

              <div className="alerts-list">
                <div className="alerts-list">
                  {securityAlerts.length === 0 && (
                    <p className="empty-alerts-message">No active security alerts.</p>
                  )}

                  {securityAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`alert-card ${alert.severity === 'Critical' ? 'danger-alert' : 'warning-alert'
                        }`}
                    >
                      <p
                        className={`alert-title ${alert.severity === 'Critical' ? 'danger-text' : 'warning-text'
                          }`}
                      >
                        {alert.title}
                      </p>

                      <p className="alert-description">{alert.description}</p>
                    </div>
                  ))}
                </div>
                <div className="alert-card warning-alert">
                  <p className="alert-title warning-text">
                    Expired Vehicle Certificate
                  </p>
                  <p className="alert-description">
                    One or more vehicles require certificate renewal.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel-card">
              <h3 className="panel-title">System Flow</h3>

              <div className="architecture-flow">
                <div className="architecture-step">Vehicle Layer</div>
                <div className="flow-arrow">↓</div>
                <div className="architecture-step">RSU Infrastructure</div>
                <div className="flow-arrow">↓</div>
                <div className="architecture-step">V2I Communication</div>
                <div className="flow-arrow">↓</div>
                <div className="architecture-step">Authentication Server</div>
                <div className="flow-arrow">↓</div>
                <div className="architecture-step">Cloud Database</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}