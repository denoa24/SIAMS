import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../services/api';
import './SecurityAlertsPage.css';

type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

type SecurityAlert = {
  id: number;
  title: string;
  vehicleId: string;
  rsuId: string;
  severity: AlertSeverity;
  timestamp: string;
  description: string;
};

export function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedRsu, setSelectedRsu] = useState('');

  const loadAlerts = async () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.append('search', search.trim());
    }

    if (selectedSeverity) {
      params.append('severity', selectedSeverity);
    }

    if (selectedRsu) {
      params.append('rsu', selectedRsu);
    }

    const queryString = params.toString();
    const url = queryString
      ? `/security-alerts?${queryString}`
      : '/security-alerts';

    const response = await api.get(url);
    setAlerts(response.data);
  };

  const resetFilters = async () => {
    setSearch('');
    setSelectedSeverity('');
    setSelectedRsu('');

    const response = await api.get('/security-alerts');
    setAlerts(response.data);
  };

  const dismissAlert = async (alertId: number) => {
    await api.delete(`/security-alerts/${alertId}`);

    setAlerts((currentAlerts) =>
      currentAlerts.filter((alert) => alert.id !== alertId)
    );
  };

  useEffect(() => {
    api.get('/security-alerts').then((response) => {
      setAlerts(response.data);
    });
  }, []);

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === 'Critical'
  ).length;

  const highAlerts = alerts.filter(
    (alert) => alert.severity === 'High'
  ).length;

  const mediumAlerts = alerts.filter(
    (alert) => alert.severity === 'Medium'
  ).length;

  const lowAlerts = alerts.filter(
    (alert) => alert.severity === 'Low'
  ).length;

  return (
    <div className="security-page">
      <PageHeader
        title="Security Alerts"
        description="Monitor suspicious activities, authentication failures and communication anomalies."
      />

      <div className="security-filters">
        <input
          type="text"
          placeholder="Search vehicle ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              loadAlerts();
            }
          }}
        />

        <select
          value={selectedSeverity}
          onChange={(event) => setSelectedSeverity(event.target.value)}
        >
          <option value="">All severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={selectedRsu}
          onChange={(event) => setSelectedRsu(event.target.value)}
        >
          <option value="">All RSUs</option>
          <option value="RSU-02">RSU-02</option>
          <option value="RSU-04">RSU-04</option>
          <option value="RSU-09">RSU-09</option>
          <option value="RSU-11">RSU-11</option>
        </select>

        <button className="investigate-button" onClick={loadAlerts}>
          Search
        </button>

        <button className="dismiss-button" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <div className="security-summary">
        <div className="security-summary-card critical-border">
          <h3>Critical Alerts</h3>
          <p>{criticalAlerts}</p>
        </div>

        <div className="security-summary-card high-border">
          <h3>High Severity</h3>
          <p>{highAlerts}</p>
        </div>

        <div className="security-summary-card medium-border">
          <h3>Medium Severity</h3>
          <p>{mediumAlerts}</p>
        </div>

        <div className="security-summary-card low-border">
          <h3>Low Severity</h3>
          <p>{lowAlerts}</p>
        </div>
      </div>

      <div className="alerts-grid">
        {alerts.map((alert) => (
          <div key={alert.id} className="security-alert-card">
            <div className="alert-card-header">
              <div>
                <h2>{alert.title}</h2>
                <p>{alert.description}</p>
              </div>

              <span className={`severity-badge ${alert.severity.toLowerCase()}`}>
                {alert.severity}
              </span>
            </div>

            <div className="alert-details-grid">
              <div>
                <span>Vehicle ID</span>
                <strong>{alert.vehicleId}</strong>
              </div>

              <div>
                <span>RSU</span>
                <strong>{alert.rsuId}</strong>
              </div>

              <div>
                <span>Timestamp</span>
                <strong>{alert.timestamp}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>Active</strong>
              </div>
            </div>

            <div className="alert-actions">
              <button
                className="investigate-button"
                onClick={() => setSelectedAlert(alert)}
              >
                Investigate
              </button>

              <button
                className="dismiss-button"
                onClick={() => dismissAlert(alert.id)}
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="security-alert-card">
            <p className="empty-alerts-message">
              No security alerts found.
            </p>
          </div>
        )}
      </div>

      {selectedAlert && (
        <div className="investigation-modal-overlay">
          <div className="investigation-modal">
            <div className="investigation-header">
              <h2>Alert Investigation</h2>

              <button
                className="close-modal-button"
                onClick={() => setSelectedAlert(null)}
              >
                ✕
              </button>
            </div>

            <div className="investigation-content">
              <p>
                <strong>Alert:</strong> {selectedAlert.title}
              </p>

              <p>
                <strong>Vehicle ID:</strong> {selectedAlert.vehicleId}
              </p>

              <p>
                <strong>RSU:</strong> {selectedAlert.rsuId}
              </p>

              <p>
                <strong>Severity:</strong> {selectedAlert.severity}
              </p>

              <p>
                <strong>Timestamp:</strong> {selectedAlert.timestamp}
              </p>

              <p>
                <strong>Description:</strong> {selectedAlert.description}
              </p>

              <div className="investigation-recommendation">
                <h3>Recommended Action</h3>
                <p>
                  Verify the vehicle certificate, review recent access attempts
                  and temporarily restrict access if suspicious activity
                  continues.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}