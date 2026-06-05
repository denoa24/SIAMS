import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../services/api';
import './RsuMonitoringPage.css';

type RsuStatus = 'Online' | 'Warning' | 'Offline';

type Rsu = {
  id: string;
  location: string;
  status: RsuStatus;
  connectedVehicles: number;
  health: number;
  lastSignal: string;
};

export function RsuMonitoringPage() {
  const [rsus, setRsus] = useState<Rsu[]>([]);

  useEffect(() => {
    api.get('/rsus').then((response) => {
      setRsus(response.data);
    });
  }, []);

  return (
    <div className="rsu-page">
      <PageHeader
        title="RSU Monitoring"
        description="Monitor Road Side Units, infrastructure status and connected vehicles."
      />

      <div className="rsu-summary-grid">
        <div className="rsu-summary-card">
          <h3>Total RSUs</h3>
          <p>{rsus.length}</p>
        </div>

        <div className="rsu-summary-card online-border">
          <h3>Online</h3>
          <p>{rsus.filter((rsu) => rsu.status === 'Online').length}</p>
        </div>

        <div className="rsu-summary-card warning-border">
          <h3>Warning</h3>
          <p>{rsus.filter((rsu) => rsu.status === 'Warning').length}</p>
        </div>

        <div className="rsu-summary-card offline-border">
          <h3>Offline</h3>
          <p>{rsus.filter((rsu) => rsu.status === 'Offline').length}</p>
        </div>
      </div>

      <div className="rsu-grid">
        {rsus.map((rsu) => (
          <div key={rsu.id} className="rsu-card">
            <div className="rsu-card-header">
              <div>
                <h2>{rsu.id}</h2>
                <p>{rsu.location}</p>
              </div>

              <span className={`rsu-status ${rsu.status.toLowerCase()}`}>
                {rsu.status}
              </span>
            </div>

            <div className="rsu-details">
              <div>
                <span>Connected Vehicles</span>
                <strong>{rsu.connectedVehicles}</strong>
              </div>

              <div>
                <span>Last Signal</span>
                <strong>{rsu.lastSignal}</strong>
              </div>
            </div>

            <div className="health-section">
              <div className="health-info">
                <span>Health Score</span>
                <strong>{rsu.health}%</strong>
              </div>

              <div className="health-bar">
                <div
                  className={`health-fill ${
                    rsu.health >= 80
                      ? 'good-health'
                      : rsu.health >= 60
                      ? 'medium-health'
                      : 'bad-health'
                  }`}
                  style={{ width: `${rsu.health}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}