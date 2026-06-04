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

  useEffect(() => {
    const loadAlerts = async () => {
      const response = await api.get('/security-alerts');
      setAlerts(response.data);
    };

    loadAlerts();
  }, []);

  const criticalAlerts = alerts.filter((alert) => alert.severity === 'Critical').length;
  const highAlerts = alerts.filter((alert) => alert.severity === 'High').length;
  const mediumAlerts = alerts.filter((alert) => alert.severity === 'Medium').length;
  const lowAlerts = alerts.filter((alert) => alert.severity === 'Low').length;

  return (
    <div className="security-page">
      <PageHeader
        title="Security Alerts"
        description="Monitor suspicious activities, authentication failures and communication anomalies."
      />

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
              <button className="investigate-button">Investigate</button>
              <button className="dismiss-button">Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}