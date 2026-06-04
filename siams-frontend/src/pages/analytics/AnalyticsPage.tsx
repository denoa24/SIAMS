import { PageHeader } from '../../components/PageHeader';
import './AnalyticsPage.css';

type Metric = {
  title: string;
  value: string;
  trend: string;
  type: 'success' | 'warning' | 'danger' | 'info';
};

type ChartBar = {
  label: string;
  value: number;
};

export function AnalyticsPage() {
  const metrics: Metric[] = [
    {
      title: 'Authentication Success Rate',
      value: '95.5%',
      trend: '+2.3% this week',
      type: 'success',
    },
    {
      title: 'Denied Requests',
      value: '56',
      trend: '-8 compared to yesterday',
      type: 'danger',
    },
    {
      title: 'Average Response Time',
      value: '120ms',
      trend: 'Stable',
      type: 'info',
    },
    {
      title: 'RSU Load',
      value: '72%',
      trend: 'Moderate usage',
      type: 'warning',
    },
  ];

  const hourlyRequests: ChartBar[] = [
    { label: '08:00', value: 35 },
    { label: '10:00', value: 58 },
    { label: '12:00', value: 76 },
    { label: '14:00', value: 92 },
    { label: '16:00', value: 64 },
    { label: '18:00', value: 48 },
  ];

  const rsuLoad: ChartBar[] = [
    { label: 'RSU-01', value: 60 },
    { label: 'RSU-02', value: 85 },
    { label: 'RSU-03', value: 45 },
    { label: 'RSU-04', value: 72 },
    { label: 'RSU-05', value: 38 },
  ];

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
          <div className="analytics-card-header">
            <div>
              <h2>Authentication Requests per Hour</h2>
              <p>Simulated V2I access requests during the current day.</p>
            </div>
          </div>

          <div className="bar-chart">
            {hourlyRequests.map((item) => (
              <div key={item.label} className="bar-item">
                <div className="bar-wrapper">
                  <div
                    className="bar-fill"
                    style={{ height: `${item.value}%` }}
                  ></div>
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>RSU Load Distribution</h2>
              <p>Current simulated infrastructure usage.</p>
            </div>
          </div>

          <div className="horizontal-chart">
            {rsuLoad.map((item) => (
              <div key={item.label} className="horizontal-bar-row">
                <div className="horizontal-bar-info">
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>

                <div className="horizontal-bar-track">
                  <div
                    className="horizontal-bar-fill"
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card wide-card">
          <h2>System Performance Summary</h2>

          <div className="performance-grid">
            <div>
              <span>Total Vehicles Processed</span>
              <strong>12,840</strong>
            </div>

            <div>
              <span>Successful Authentications</span>
              <strong>12,264</strong>
            </div>

            <div>
              <span>Failed Authentications</span>
              <strong>576</strong>
            </div>

            <div>
              <span>Active RSUs</span>
              <strong>24</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}