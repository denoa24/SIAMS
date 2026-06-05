import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../services/api';
import './AnalyticsPage.css';

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

type Vehicle = {
  id: string;
  status: string;
  speed: number;
  location: string;
  rsu: string;
  certificate: string;
  lastSeen: string;
};

type AccessRequest = {
  id: number;
  vehicleId: string;
  rsuId: string;
  status: string;
  timestamp: string;
  reason: string;
};

type SecurityAlert = {
  id: number;
  title: string;
  vehicleId: string;
  rsuId: string;
  severity: string;
  timestamp: string;
  description: string;
};

type Rsu = {
  id: string;
  location: string;
  status: string;
  connectedVehicles: number;
  health: number;
  lastSignal: string;
};

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    api.get('/analytics').then((response) => {
      setAnalytics(response.data);
    });
  }, []);

  if (!analytics) {
    return (
      <div className="analytics-page">
        <PageHeader
          title="Analytics"
          description="Analyze authentication activity, RSU load and system performance."
        />

        <p className="loading-message">Loading analytics...</p>
      </div>
    );
  }

  const successRate =
    analytics.totalVehicles === 0
      ? 0
      : Math.round(
        (analytics.authenticatedVehicles / analytics.totalVehicles) * 100
      );

  const deniedRate =
    analytics.totalVehicles === 0
      ? 0
      : Math.round((analytics.deniedVehicles / analytics.totalVehicles) * 100);

  const pendingRate =
    analytics.totalVehicles === 0
      ? 0
      : Math.round((analytics.pendingVehicles / analytics.totalVehicles) * 100);

  const validCertificateRate =
    analytics.totalVehicles === 0
      ? 0
      : Math.round((analytics.validCertificates / analytics.totalVehicles) * 100);

  const expiredCertificateRate =
    analytics.totalVehicles === 0
      ? 0
      : Math.round(
        (analytics.expiredCertificates / analytics.totalVehicles) * 100
      );

  const metrics = [
    {
      title: 'Total Vehicles',
      value: `${analytics.totalVehicles}`,
      trend: 'Connected vehicles registered in SIAMS',
      type: 'info',
    },
    {
      title: 'Authenticated Vehicles',
      value: `${analytics.authenticatedVehicles}`,
      trend: `${successRate}% of total vehicles`,
      type: 'success',
    },
    {
      title: 'Denied Vehicles',
      value: `${analytics.deniedVehicles}`,
      trend: `${deniedRate}% of total vehicles`,
      type: 'danger',
    },
    {
      title: 'Security Alerts',
      value: `${analytics.totalAlerts}`,
      trend: 'Generated from denied access events',
      type: 'warning',
    },
  ] as const;

  const generateSecurityReport = async () => {
    const vehiclesResponse = await api.get('/vehicles');
    const requestsResponse = await api.get('/access-requests');
    const alertsResponse = await api.get('/security-alerts');
    const rsusResponse = await api.get('/rsus');

    const vehicles: Vehicle[] = vehiclesResponse.data;
    const requests: AccessRequest[] = requestsResponse.data;
    const alerts: SecurityAlert[] = alertsResponse.data;
    const rsus: Rsu[] = rsusResponse.data;

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('SIAMS Security Report', 14, 18);

    doc.setFontSize(11);
    doc.text(`Generated at: ${new Date().toLocaleString()}`, 14, 28);

    doc.setFontSize(14);
    doc.text('System Summary', 14, 42);

    autoTable(doc, {
      startY: 48,
      head: [['Metric', 'Value']],
      body: [
        ['Total Vehicles', String(analytics?.totalVehicles ?? 0)],
        ['Authenticated Vehicles', String(analytics?.authenticatedVehicles ?? 0)],
        ['Denied Vehicles', String(analytics?.deniedVehicles ?? 0)],
        ['Pending Vehicles', String(analytics?.pendingVehicles ?? 0)],
        ['Valid Certificates', String(analytics?.validCertificates ?? 0)],
        ['Expired Certificates', String(analytics?.expiredCertificates ?? 0)],
        ['Total Access Requests', String(analytics?.totalRequests ?? 0)],
        ['Total Security Alerts', String(analytics?.totalAlerts ?? 0)],
      ],
    });

    autoTable(doc, {
      head: [['Vehicle ID', 'Status', 'Certificate', 'RSU', 'Location']],
      body: vehicles.map((vehicle) => [
        vehicle.id,
        vehicle.status,
        vehicle.certificate,
        vehicle.rsu,
        vehicle.location,
      ]),
      margin: { top: 14 },
    });

    autoTable(doc, {
      head: [['ID', 'Vehicle', 'RSU', 'Status', 'Timestamp', 'Reason']],
      body: requests.map((request) => [
        request.id,
        request.vehicleId,
        request.rsuId,
        request.status,
        request.timestamp,
        request.reason,
      ]),
      margin: { top: 14 },
    });

    autoTable(doc, {
      head: [['ID', 'Vehicle', 'RSU', 'Severity', 'Timestamp', 'Description']],
      body: alerts.map((alert) => [
        alert.id,
        alert.vehicleId,
        alert.rsuId,
        alert.severity,
        alert.timestamp,
        alert.description,
      ]),
      margin: { top: 14 },
    });

    autoTable(doc, {
      head: [['RSU', 'Location', 'Status', 'Connected Vehicles', 'Health', 'Last Signal']],
      body: rsus.map((rsu) => [
        rsu.id,
        rsu.location,
        rsu.status,
        String(rsu.connectedVehicles),
        `${rsu.health}%`,
        rsu.lastSignal,
      ]),
      margin: { top: 14 },
    });

    doc.save('siams-security-report.pdf');
  };

  return (
    <div className="analytics-page">
      <PageHeader
        title="Analytics"
        description="Analyze authentication activity, RSU load and system performance."
      />
      <div className="analytics-actions">
        <button className="generate-report-button" onClick={generateSecurityReport}>
          Generate Security Report
        </button>
      </div>

      <section className="analytics-metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.title} className={`analytics-metric-card ${metric.type}`}>
            <h3>{metric.title}</h3>
            <p>{metric.value}</p>
            <span>{metric.trend}</span>
          </div>
        ))}
      </section>

      <section className="analytics-grid">
        <div className="analytics-card">
          <h2>Vehicle Status Distribution</h2>
          <p>Current distribution of vehicles by authentication state.</p>

          <div className="horizontal-chart">
            <div className="horizontal-bar-row">
              <div className="horizontal-bar-info">
                <span>Authenticated</span>
                <strong>{successRate}%</strong>
              </div>

              <div className="horizontal-bar-track">
                <div
                  className="horizontal-bar-fill"
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
            </div>

            <div className="horizontal-bar-row">
              <div className="horizontal-bar-info">
                <span>Denied</span>
                <strong>{deniedRate}%</strong>
              </div>

              <div className="horizontal-bar-track">
                <div
                  className="horizontal-bar-fill denied-fill"
                  style={{ width: `${deniedRate}%` }}
                ></div>
              </div>
            </div>

            <div className="horizontal-bar-row">
              <div className="horizontal-bar-info">
                <span>Pending</span>
                <strong>{pendingRate}%</strong>
              </div>

              <div className="horizontal-bar-track">
                <div
                  className="horizontal-bar-fill pending-fill"
                  style={{ width: `${pendingRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h2>Certificate Overview</h2>
          <p>Vehicle certificate validity inside the SIAMS system.</p>

          <div className="horizontal-chart">
            <div className="horizontal-bar-row">
              <div className="horizontal-bar-info">
                <span>Valid Certificates</span>
                <strong>{validCertificateRate}%</strong>
              </div>

              <div className="horizontal-bar-track">
                <div
                  className="horizontal-bar-fill"
                  style={{ width: `${validCertificateRate}%` }}
                ></div>
              </div>
            </div>

            <div className="horizontal-bar-row">
              <div className="horizontal-bar-info">
                <span>Expired Certificates</span>
                <strong>{expiredCertificateRate}%</strong>
              </div>

              <div className="horizontal-bar-track">
                <div
                  className="horizontal-bar-fill denied-fill"
                  style={{ width: `${expiredCertificateRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card wide-card">
          <h2>System Performance Summary</h2>

          <div className="performance-grid">
            <div>
              <span>Total Access Requests</span>
              <strong>{analytics.totalRequests}</strong>
            </div>

            <div>
              <span>Authenticated Vehicles</span>
              <strong>{analytics.authenticatedVehicles}</strong>
            </div>

            <div>
              <span>Pending Vehicles</span>
              <strong>{analytics.pendingVehicles}</strong>
            </div>

            <div>
              <span>Security Alerts</span>
              <strong>{analytics.totalAlerts}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}