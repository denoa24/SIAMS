import './VehiclesPage.css';
import { PageHeader } from '../../components/PageHeader';

type VehicleStatus = 'Authenticated' | 'Denied' | 'Pending';

type Vehicle = {
  id: string;
  driver: string;
  status: VehicleStatus;
  speed: number;
  location: string;
  rsu: string;
  lastSeen: string;
  certificate: 'Valid' | 'Expired';
};

export function VehiclesPage() {
  const vehicles: Vehicle[] = [
    {
      id: 'VH-1024',
      driver: 'Connected Vehicle',
      status: 'Authenticated',
      speed: 48,
      location: 'Bucharest - Sector 1',
      rsu: 'RSU-04',
      lastSeen: '14:32:12',
      certificate: 'Valid',
    },
    {
      id: 'VH-2201',
      driver: 'Connected Vehicle',
      status: 'Denied',
      speed: 35,
      location: 'Bucharest - Sector 3',
      rsu: 'RSU-11',
      lastSeen: '14:31:04',
      certificate: 'Expired',
    },
    {
      id: 'VH-8891',
      driver: 'Connected Vehicle',
      status: 'Authenticated',
      speed: 62,
      location: 'Bucharest - Sector 6',
      rsu: 'RSU-02',
      lastSeen: '14:29:18',
      certificate: 'Valid',
    },
    {
      id: 'VH-4502',
      driver: 'Connected Vehicle',
      status: 'Pending',
      speed: 41,
      location: 'Bucharest - Sector 4',
      rsu: 'RSU-09',
      lastSeen: '14:27:55',
      certificate: 'Valid',
    },
  ];

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
                    className={`certificate-badge ${vehicle.certificate === 'Valid' ? 'valid' : 'expired'
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