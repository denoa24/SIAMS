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

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const activityLogs = [
    {
      vehicle: 'VH-1024',
      rsu: 'RSU-04',
      status: 'Authenticated',
      time: '14:32:12',
    },
    {
      vehicle: 'VH-2201',
      rsu: 'RSU-11',
      status: 'Denied',
      time: '14:31:04',
    },
    {
      vehicle: 'VH-8891',
      rsu: 'RSU-02',
      status: 'Authenticated',
      time: '14:29:18',
    },
    {
      vehicle: 'VH-4502',
      rsu: 'RSU-09',
      status: 'Pending',
      time: '14:27:55',
    },
  ];

  useEffect(() => {
    const loadDashboardStats = async () => {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    };

    loadDashboardStats();
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

              <button className="search-button">Simulate Access</button>
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
                    <tr key={`${log.vehicle}-${log.time}`} className="table-row">
                      <td>{log.vehicle}</td>
                      <td>{log.rsu}</td>
                      <td>
                        <span className={`status-badge ${log.status.toLowerCase()}`}>
                          {log.status}
                        </span>
                      </td>
                      <td>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}