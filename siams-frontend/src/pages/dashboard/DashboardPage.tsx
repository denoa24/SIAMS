import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/api';
import './DashboardPage.css';

type DashboardStats = {
  connectedVehicles: number;
  authenticatedVehicles: number;
  deniedRequests: number;
  activeRSUs: number;
};

type AnalyticsData = {
  totalVehicles: number;
  authenticatedVehicles: number;
  deniedVehicles: number;
  pendingVehicles: number;
  validCertificates: number;
  expiredCertificates: number;
  totalRequests: number;
  totalAlerts: number;
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

type Vehicle = {
  id: string;
  status: 'Authenticated' | 'Denied' | 'Pending';
  speed: number;
  location: string;
  rsu: string;
  lastSeen: string;
  certificate: 'Valid' | 'Expired';
};

type Rsu = {
  id: string;
  location: string;
  status: string;
  connectedVehicles: number;
  health: number;
  lastSignal: string;
};

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [averageRsuHealth, setAverageRsuHealth] = useState(0);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);

  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationCount, setSimulationCount] = useState(0);

  const [vehicleSearch, setVehicleSearch] = useState('');
  const [searchResult, setSearchResult] = useState<Vehicle | null>(null);
  const [searchMessage, setSearchMessage] = useState('');

  const updateAverageRsuHealth = useCallback((rsus: Rsu[]) => {
    const totalRsuHealth = rsus.reduce(
      (sum, rsu) => sum + rsu.health,
      0
    );

    setAverageRsuHealth(
      rsus.length === 0 ? 0 : Math.round(totalRsuHealth / rsus.length)
    );
  }, []);

  const loadDashboardData = useCallback(async () => {
    const statsResponse = await api.get('/dashboard/stats');
    setStats(statsResponse.data);

    const activityResponse = await api.get('/dashboard/activity');
    setActivityLogs(activityResponse.data);

    const alertsResponse = await api.get('/security-alerts');
    setSecurityAlerts(alertsResponse.data.slice(0, 2));

    const simulationResponse = await api.get('/simulation/status');
    setIsSimulationRunning(simulationResponse.data.running);
    setSimulationCount(simulationResponse.data.events);

    const analyticsResponse = await api.get('/analytics');
    setAnalytics(analyticsResponse.data);

    const rsusResponse = await api.get('/rsus');
    updateAverageRsuHealth(rsusResponse.data);
  }, [updateAverageRsuHealth]);

  const simulateAccess = async () => {
    await api.post('/access-requests/simulate');
    await loadDashboardData();
  };

  const toggleSimulation = async () => {
    if (isSimulationRunning) {
      const response = await api.post('/simulation/stop');
      setIsSimulationRunning(response.data.running);
      setSimulationCount(response.data.events);
    } else {
      const response = await api.post('/simulation/start');
      setIsSimulationRunning(response.data.running);
      setSimulationCount(response.data.events);
    }

    await loadDashboardData();
  };

  const searchVehicle = async () => {
    setSearchMessage('');
    setSearchResult(null);

    if (!vehicleSearch.trim()) {
      setSearchMessage('Please enter a vehicle ID.');
      return;
    }

    const response = await api.get(`/vehicles?search=${vehicleSearch.trim()}`);

    if (response.data.length === 0) {
      setSearchMessage('No vehicle found.');
      return;
    }

    setSearchResult(response.data[0]);
  };

  useEffect(() => {
  const loadInitialData = async () => {
    await loadDashboardData();
  };

  loadInitialData();
}, [loadDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const authenticationRate =
    analytics && analytics.totalVehicles > 0
      ? Math.round(
          (analytics.authenticatedVehicles / analytics.totalVehicles) * 100
        )
      : 0;

  const securityScore = analytics
  ? Math.max(
      0,
      Math.min(
        100,
        Math.round(
          100 -
            analytics.deniedVehicles * 2 -
            analytics.expiredCertificates * 1.5 -
            analytics.totalAlerts * 2
        )
      )
    )
  : 100;

  const systemAvailability = Math.round(
    (authenticationRate + averageRsuHealth + securityScore) / 3
  );

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
              placeholder="Search vehicle ID..."
              className="search-input"
              value={vehicleSearch}
              onChange={(event) => setVehicleSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  searchVehicle();
                }
              }}
            />

            <button className="search-button" onClick={searchVehicle}>
              Search
            </button>
          </div>
        </div>

        <div className="simulation-status-banner">
          <div
            className={
              isSimulationRunning
                ? 'simulation-status running'
                : 'simulation-status stopped'
            }
          >
            <span className="simulation-status-dot"></span>

            {isSimulationRunning
              ? `Simulation Running • ${simulationCount} Events`
              : `Simulation Stopped • ${simulationCount} Events`}
          </div>
        </div>

        {searchMessage && (
          <p className="dashboard-search-message">{searchMessage}</p>
        )}

        {searchResult && (
          <div className="dashboard-search-result">
            <div>
              <span>Vehicle ID</span>
              <strong>{searchResult.id}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{searchResult.status}</strong>
            </div>

            <div>
              <span>Certificate</span>
              <strong>{searchResult.certificate}</strong>
            </div>

            <div>
              <span>RSU</span>
              <strong>{searchResult.rsu}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{searchResult.location}</strong>
            </div>
          </div>
        )}

        <section className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span>Security Score</span>
              <strong>{securityScore}%</strong>
            </div>

            <div className="kpi-ring">
              <div
                className="kpi-ring-fill"
                style={{ width: `${securityScore}%` }}
              />
            </div>

            <p>
              Calculated from denied vehicles, expired certificates and alerts.
            </p>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span>Authentication Rate</span>
              <strong>{authenticationRate}%</strong>
            </div>

            <div className="kpi-ring">
              <div
                className="kpi-ring-fill success"
                style={{ width: `${authenticationRate}%` }}
              />
            </div>

            <p>
              Percentage of registered vehicles currently authenticated.
            </p>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span>Average RSU Health</span>
              <strong>{averageRsuHealth}%</strong>
            </div>

            <div className="kpi-ring">
              <div
                className="kpi-ring-fill warning"
                style={{ width: `${averageRsuHealth}%` }}
              />
            </div>

            <p>
              Average health score across all monitored RSU units.
            </p>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span>System Availability</span>
              <strong>{systemAvailability}%</strong>
            </div>

            <div className="kpi-ring">
              <div
                className="kpi-ring-fill"
                style={{ width: `${systemAvailability}%` }}
              />
            </div>

            <p>
              Combined score based on authentication, RSU health and security.
            </p>
          </div>
        </section>

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

              <div className="simulation-actions">
                <button className="search-button" onClick={simulateAccess}>
                  Simulate Once
                </button>

                <button
                  className={
                    isSimulationRunning
                      ? 'simulation-stop-button'
                      : 'simulation-start-button'
                  }
                  onClick={toggleSimulation}
                >
                  {isSimulationRunning ? 'Stop Simulation' : 'Start Simulation'}
                </button>
              </div>
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

                  {activityLogs.length === 0 && (
                    <tr>
                      <td colSpan={4}>No activity yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="right-panels">
            <div className="panel-card">
              <h3 className="panel-title">Security Alerts</h3>

              <div className="alerts-list">
                {securityAlerts.length === 0 && (
                  <p className="empty-alerts-message">
                    No active security alerts.
                  </p>
                )}

                {securityAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`alert-card ${
                      alert.severity === 'Critical'
                        ? 'danger-alert'
                        : 'warning-alert'
                    }`}
                  >
                    <p
                      className={`alert-title ${
                        alert.severity === 'Critical'
                          ? 'danger-text'
                          : 'warning-text'
                      }`}
                    >
                      {alert.title}
                    </p>

                    <p className="alert-description">
                      {alert.description}
                    </p>
                  </div>
                ))}
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
                <div className="architecture-step">JSON Persistence Layer</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}