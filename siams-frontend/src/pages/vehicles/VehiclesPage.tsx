import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
  lat?: number;
  lng?: number;
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

  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  const loadVehicles = async () => {
    const params = new URLSearchParams();

    if (search.trim()) params.append('search', search.trim());
    if (selectedStatus) params.append('status', selectedStatus);
    if (selectedRsu) params.append('rsu', selectedRsu);
    if (selectedCertificate) params.append('certificate', selectedCertificate);

    const queryString = params.toString();
    const url = queryString ? `/vehicles?${queryString}` : '/vehicles';

    try {
      setLoading(true);
      setPageError('');

      const response = await api.get(url);
      setVehicles(response.data);
    } catch {
      setPageError('Could not load vehicles.');
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async () => {
    setFormError('');

    if (!vehicleId.trim() || !location.trim() || !speed || !rsu.trim()) {
      setFormError('Please complete all vehicle fields.');
      return;
    }

    if (Number(speed) < 0) {
      setFormError('Speed cannot be negative.');
      return;
    }

    try {
      await api.post('/vehicles', {
        id: vehicleId.trim(),
        speed: Number(speed),
        location: location.trim(),
        rsu: rsu.trim(),
        certificate,
      });

      setVehicleId('');
      setLocation('');
      setSpeed('');
      setRsu('');
      setCertificate('Valid');

      await loadVehicles();
      toast.success('Vehicle added successfully.');
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        setFormError(
          axiosError.response?.data?.message || 'Could not add vehicle.'
        );
        return;
      }

      setFormError('Could not add vehicle.');
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    const confirmed = window.confirm(`Delete vehicle ${vehicleId}?`);

    if (!confirmed) return;

    try {
      await api.delete(`/vehicles/${vehicleId}`);
      await loadVehicles();
      toast.success('Vehicle deleted successfully.');
    } catch {
      setPageError('Could not delete vehicle.');
    }
  };

  const toggleCertificate = async (vehicleId: string) => {
    try {
      await api.put(`/vehicles/${vehicleId}/toggle-certificate`);
      await loadVehicles();
      toast.info('Vehicle certificate updated.');
    } catch {
      toast.error('Could not complete the action.');
    }
  };

  const resetFilters = async () => {
    setSearch('');
    setSelectedStatus('');
    setSelectedRsu('');
    setSelectedCertificate('');

    try {
      setLoading(true);
      setPageError('');

      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch {
      setPageError('Could not reset filters.');
    } finally {
      setLoading(false);
    }
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

        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        >
          <option value="">Select location</option>
          <option value="Bucharest - Sector 1">Bucharest - Sector 1</option>
          <option value="Bucharest - Sector 2">Bucharest - Sector 2</option>
          <option value="Bucharest - Sector 3">Bucharest - Sector 3</option>
          <option value="Bucharest - Sector 4">Bucharest - Sector 4</option>
          <option value="Bucharest - Sector 5">Bucharest - Sector 5</option>
          <option value="Bucharest - Sector 6">Bucharest - Sector 6</option>
        </select>

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

      {formError && (
        <p className="form-error-message">
          {formError}
        </p>
      )}

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

      {loading && (
        <p className="loading-message">
          Loading vehicles...
        </p>
      )}

      {pageError && (
        <p className="page-error-message">
          {pageError}
        </p>
      )}

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
              <th>Actions</th>
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

                <td className="vehicle-actions">
                  <button
                    className="toggle-certificate-button"
                    onClick={() => toggleCertificate(vehicle.id)}
                  >
                    Toggle Certificate
                  </button>

                  <button
                    className="delete-vehicle-button"
                    onClick={() => deleteVehicle(vehicle.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {vehicles.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="empty-table-message">
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