import { PageHeader } from '../../components/PageHeader';
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
  const alerts: SecurityAlert[] = [
    {
      id: 1,
      title: 'Unauthorized Access Attempt',
      vehicleId: 'VH-2201',
      rsuId: 'RSU-11',
      severity: 'Critical',
      timestamp: '14:31:04',
      description: 'Vehicle attempted to access infrastructure with an expired certificate.',
    },
    {
      id: 2,
      title: 'Expired Vehicle Certificate',
      vehicleId: 'VH-9911',
      rsuId: 'RSU-07',
      severity: 'High',
      timestamp: '14:25:44',
      description: 'Vehicle certificate is no longer valid and requires renewal.',
    },
    {
      id: 3,
      title: 'Multiple Failed Authentications',
      vehicleId: 'VH-3088',
      rsuId: 'RSU-03',
      severity: 'Medium',
      timestamp: '14:18:12',
      description: 'Several failed authentication attempts were detected from the same vehicle.',
    },
    {
      id: 4,
      title: 'Communication Delay Detected',
      vehicleId: 'VH-7102',
      rsuId: 'RSU-09',
      severity: 'Low',
      timestamp: '14:10:27',
      description: 'Delayed response detected between the vehicle and the RSU unit.',
    },
  ];

  return (
    <div className="security-page">
      <PageHeader
        title="Security Alerts"
        description="Monitor suspicious activities, authentication failures and communication anomalies."
      />

      <div className="security-summary">
        <div className="security-summary-card critical-border">
          <h3>Critical Alerts</h3>
          <p>3</p>
        </div>

        <div className="security-summary-card high-border">
          <h3>High Severity</h3>
          <p>7</p>
        </div>

        <div className="security-summary-card medium-border">
          <h3>Medium Severity</h3>
          <p>12</p>
        </div>

        <div className="security-summary-card low-border">
          <h3>Low Severity</h3>
          <p>18</p>
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