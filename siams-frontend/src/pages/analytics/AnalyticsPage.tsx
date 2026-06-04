import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../services/api';
import './AnalyticsPage.css';

type AnalyticsData = {
  totalRequests: number;
  grantedRequests: number;
  deniedRequests: number;
  successRate: number;
  deniedRate: number;
  totalVehicles: number;
  totalAlerts: number;
  activeRSUs: number;
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

        <p>Loading analytics...</p>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Authentication Success Rate',
      value: `${analytics.successRate}%`,
      trend: `${analytics.grantedRequests} granted requests`,
      type: 'success',
    },
    {
      title: 'Denied Requests',
      value: `${analytics.deniedRequests}`,
      trend: `${analytics.deniedRate}% denied rate`,
      type: 'danger',
    },
    {
      title: 'Total Security Alerts',
      value: `${analytics.totalAlerts}`,
      trend: 'Generated from denied requests',
      type: 'warning',
    },
    {
      title: 'Active RSUs',
      value: `${analytics.activeRSUs}`,
      trend: `${analytics.totalVehicles} connected vehicles`,
      type: 'info',
    },
  ] as const;

  return (
    <div className="analytics-page">
      <PageHeader
        title="Analytics"
        description="Analyze authentication activity, RSU load and system performance."
      />

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
          <h2>Authentication Overview</h2>
          <p>Current success and denied request distribution.</p>

          <div className="horizontal-chart">
            <div className="horizontal-bar-row">
              <div className="horizontal-bar-info">
                <span>Granted Requests</span>
                <strong>{analytics.successRate}%</strong>
              </div>

              <div className="horizontal-bar-track">
                <div
                  className="horizontal-bar-fill"
                  style={{ width: `${analytics.successRate}%` }}
                ></div>
              </div>
            </div>

            <div className="horizontal-bar-row">
              <div className="horizontal-bar-info">
                <span>Denied Requests</span>
                <strong>{analytics.deniedRate}%</strong>
              </div>

              <div className="horizontal-bar-track">
                <div
                  className="horizontal-bar-fill denied-fill"
                  style={{ width: `${analytics.deniedRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h2>System Summary</h2>
          <p>General backend-generated monitoring data.</p>

          <div className="performance-grid small-summary">
            <div>
              <span>Total Requests</span>
              <strong>{analytics.totalRequests}</strong>
            </div>

            <div>
              <span>Granted</span>
              <strong>{analytics.grantedRequests}</strong>
            </div>

            <div>
              <span>Denied</span>
              <strong>{analytics.deniedRequests}</strong>
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