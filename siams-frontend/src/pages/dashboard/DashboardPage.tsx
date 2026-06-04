import { Sidebar } from '../../components/Sidebar';
import './DashboardPage.css';

export function DashboardPage() {
  const stats = [
    {
      title: 'Connected Vehicles',
      value: '1,248',
      status: 'Online',
    },
    {
      title: 'Authenticated Vehicles',
      value: '1,192',
      status: 'Secure',
    },
    {
      title: 'Denied Access Attempts',
      value: '56',
      status: 'Warning',
    },
    {
      title: 'Active RSUs',
      value: '24',
      status: 'Operational',
    },
  ];

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
          {stats.map((stat) => (
            <div key={stat.title} className="stat-card">
              <div className="stat-header">
                <p className="stat-title">{stat.title}</p>

                <span className="stat-badge">{stat.status}</span>
              </div>

              <h3 className="stat-value">{stat.value}</h3>
            </div>
          ))}
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
                        <span
                          className={`status-badge ${log.status.toLowerCase()}`}
                        >
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

          <div className="right-panels">
            <div className="panel-card">
              <h3 className="panel-title">Security Alerts</h3>

              <div className="alerts-list">
                <div className="alert-card danger-alert">
                  <p className="alert-title danger-text">
                    Unauthorized Access Attempt
                  </p>
                  <p className="alert-description">
                    Vehicle VH-2201 denied at RSU-11.
                  </p>
                </div>

                <div className="alert-card warning-alert">
                  <p className="alert-title warning-text">
                    Expired Vehicle Certificate
                  </p>
                  <p className="alert-description">
                    Vehicle VH-9911 requires certificate renewal.
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