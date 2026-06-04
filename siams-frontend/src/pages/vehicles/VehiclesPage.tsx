import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../services/api';
import './VehiclesPage.css';

type VehicleStatus = 'Authenticated' | 'Denied' | 'Pending';

type Vehicle = {
  id: string;
  status: VehicleStatus;
  speed: number;
  location: string;
  rsu: string;
  lastSeen: string;
  certificate: 'Valid' | 'Expired';
};

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const loadVehicles = async () => {
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    };

    loadVehicles();
  }, []);

  return (
    <div className="vehicles-page">
      <PageHeader
        title="Connected Vehicles"
        description="Monitor connected vehicles, authentication status and RSU communication."
      />

      <div className="vehicles-filters">
        <input type="text" placeholder="Search vehicle ID..." />

        <select>
          <option>All statuses</option>
          <option>Authenticated</option>
          <option>Denied</option>
          <option>Pending</option>
        </select>

        <select>
          <option>All RSUs</option>
          <option>RSU-02</option>
          <option>RSU-04</option>
          <option>RSU-09</option>
          <option>RSU-11</option>
        </select>
      </div>

      <div className="vehicles-table-card">
        <table className="vehicles-table">
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Status</th>
              <th>Speed</th>
              <th>Location</th>
              <th>RSU</th>
              <th>Certificate</th>
              <th>Last Seen</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="vehicle-id">{vehicle.id}</td>

                <td>
                  <span className={`status-badge ${vehicle.status.toLowerCase()}`}>
                    {vehicle.status}
                  </span>
                </td>

                <td>{vehicle.speed} km/h</td>
                <td>{vehicle.location}</td>
                <td>{vehicle.rsu}</td>

                <td>
                  <span
                    className={`certificate-badge ${
                      vehicle.certificate === 'Valid' ? 'valid' : 'expired'
                    }`}
                  >
                    {vehicle.certificate}
                  </span>
                </td>

                <td>{vehicle.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}