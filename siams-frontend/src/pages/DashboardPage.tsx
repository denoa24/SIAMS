import './DashboardPage.css';

export default function DashboardPage() {
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
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <h1 className="logo-title">
            SIAMS
          </h1>
          <p className="logo-subtitle">
            Secure Intelligent Access Management System
          </p>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-button active">
            Dashboard
          </button>

          <button className="nav-button">
            Vehicles
          </button>

          <button className="nav-button">
            Access Requests
          </button>

          <button className="nav-button">
            Security Alerts
          </button>

          <button className="nav-button">
            Analytics
          </button>

          <button className="nav-button">
            Architecture
          </button>
        </nav>

        <div className="system-status">
          <p className="text-sm text-slate-400">System Status</p>

          <div className="status-row">
            <div className="status-dot"></div>
            <span className="font-medium">Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
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

            <button className="search-button">
              Search
            </button>
          </div>
        </div>

        {/* Statistics */}
        <section className="stats-grid">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="stat-card"
            >
              <div className="stat-header">
                <p className="stat-title">{stat.title}</p>

                <span className="stat-badge">
                  {stat.status}
                </span>
              </div>

              <h3 className="stat-value">{stat.value}</h3>
            </div>
          ))}
        </section>

        {/* Main Grid */}
        <section className="dashboard-grid">
          {/* Live Activity */}
          <div className="activity-panel">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold">Live Vehicle Activity</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Real-time authentication requests.
                </p>
              </div>

              <button className="simulate-button">
                Simulate Access
              </button>
            </div>

            <div className="table-container">
              <table className="activity-table">
                <thead className="table-header">
                  <tr>
                    <th className="text-left p-4">Vehicle ID</th>
                    <th className="text-left p-4">RSU</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Timestamp</th>
                  </tr>
                </thead>

                <tbody>
                  {activityLogs.map((log) => (
                    <tr
                      key={`${log.vehicle}-${log.time}`}
                      className="table-row"
                    >
                      <td className="p-4 font-medium">{log.vehicle}</td>
                      <td className="p-4">{log.rsu}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            log.status === 'Authenticated'
                              ? 'bg-green-500/20 text-green-400'
                              : log.status === 'Denied'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>

                      <td className="p-4 text-slate-400">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side Panels */}
          <div className="right-panels">
            {/* Security Alerts */}
            <div className="panel-card">
              <h3 className="panel-title">Security Alerts</h3>

              <div className="alerts-list">
                <div className="alert-card danger-alert">
                  <p className="alert-title danger-text">
                    Unauthorized Access Attempt
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Vehicle VH-2201 denied at RSU-11.
                  </p>
                </div>

                <div className="alert-card warning-alert">
                  <p className="alert-title warning-text">
                    Expired Vehicle Certificate
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Vehicle VH-9911 requires certificate renewal.
                  </p>
                </div>
              </div>
            </div>

            {/* System Architecture */}
            <div className="panel-card">
              <h3 className="panel-title">
                System Flow
              </h3>

              <div className="architecture-flow">
                <div className="architecture-step">
                  Vehicle Layer
                </div>

                <div className="flow-arrow">↓</div>

                <div className="architecture-step">
                  RSU Infrastructure
                </div>

                <div className="flow-arrow">↓</div>

                <div className="architecture-step">
                  V2I Communication
                </div>

                <div className="flow-arrow">↓</div>

                <div className="architecture-step">
                  Authentication Server
                </div>

                <div className="flow-arrow">↓</div>

                <div className="architecture-step">
                  Cloud Database
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}