import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../services/api';
import './VehiclesPage.css';

type VehicleStatus = 'Authenticated' | 'Denied' | 'Pending';
type CertificateStatus = 'Valid' | 'Expired';

type Vehicle = {
  id: string;
  status: VehicleStatus;
  speed: number;
  location: string;
  rsu: string;
  lastSeen: string;
  certificate: CertificateStatus;
};

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRsu, setSelectedRsu] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState('');

  const [vehicleId, setVehicleId] = useState('');
  const [location, setLocation] = useState('');
  const [speed, setSpeed] = useState('');
  const [rsu, setRsu] = useState('');
  const [certificate, setCertificate] = useState<CertificateStatus>('Valid');

  const loadVehicles = async () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.append('search', search.trim());
    }

    if (selectedStatus) {
      params.append('status', selectedStatus);
    }

    if (selectedRsu) {
      params.append('rsu', selectedRsu);
    }

    if (selectedCertificate) {
      params.append('certificate', selectedCertificate);
    }

    const queryString = params.toString();
    const url = queryString ? `/vehicles?${queryString}` : '/vehicles';

    const response = await api.get(url);
    setVehicles(response.data);
  };

  const addVehicle = async () => {
    if (!vehicleId || !location || !speed || !rsu) {
      return;
    }

    await api.post('/vehicles', {
      id: vehicleId,
      speed: Number(speed),
      location,
      rsu,
      certificate,
    });

    setVehicleId('');
    setLocation('');
    setSpeed('');
    setRsu('');
    setCertificate('Valid');

    await loadVehicles();
  };

  const resetFilters = async () => {
    setSearch('');
    setSelectedStatus('');
    setSelectedRsu('');
    setSelectedCertificate('');

    const response = await api.get('/vehicles');
    setVehicles(response.data);
  };

  useEffect(() => {
    api.get('/vehicles').then((response) => {
      setVehicles(response.data);
    });
  }, []);

  return (
    <div className="vehicles-page">
      <PageHeader
        title="Connected Vehicles"
        description="Monitor connected vehicles, authentication status and RSU communication."
      />

      <div className="vehicle-form">
        <input
          type="text"
          placeholder="Vehicle ID"
          value={vehicleId}
          onChange={(event) => setVehicleId(event.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />

        <input
          type="number"
          placeholder="Speed"
          value={speed}
          onChange={(event) => setSpeed(event.target.value)}
        />

        <input
          type="text"
          placeholder="RSU"
          value={rsu}
          onChange={(event) => setRsu(event.target.value)}
        />

        <select
          value={certificate}
          onChange={(event) =>
            setCertificate(event.target.value as CertificateStatus)
          }
        >
          <option value="Valid">Valid Certificate</option>
          <option value="Expired">Expired Certificate</option>
        </select>

        <button className="vehicle-search-button" onClick={addVehicle}>
          Add Vehicle
        </button>
      </div>

      <div className="vehicles-filters">
        <input
          type="text"
          placeholder="Search vehicle ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              loadVehicles();
            }
          }}
        />

        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="Authenticated">Authenticated</option>
          <option value="Denied">Denied</option>
          <option value="Pending">Pending</option>
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

        <select
          value={selectedCertificate}
          onChange={(event) => setSelectedCertificate(event.target.value)}
        >
          <option value="">All certificates</option>
          <option value="Valid">Valid Certificate</option>
          <option value="Expired">Expired Certificate</option>
        </select>

        <button className="vehicle-search-button" onClick={loadVehicles}>
          Search
        </button>

        <button className="vehicle-reset-button" onClick={resetFilters}>
          Reset
        </button>
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

            {vehicles.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-table-message">
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}