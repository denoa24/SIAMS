import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { PageHeader } from '../../components/PageHeader';
import { api } from '../../services/api';
import './LiveMapPage.css';

type VehicleStatus = 'Authenticated' | 'Denied' | 'Pending';

type Vehicle = {
  id: string;
  status: VehicleStatus;
  speed: number;
  location: string;
  rsu: string;
  lastSeen: string;
  certificate: 'Valid' | 'Expired';
  lat: number;
  lng: number;
};

const createMarkerIcon = (status: VehicleStatus) => {
  let color = '#22c55e';

  if (status === 'Denied') {
    color = '#ef4444';
  }

  if (status === 'Pending') {
    color = '#f59e0b';
  }

  return L.divIcon({
    className: '',
    html: `
      <div
        style="
          width:18px;
          height:18px;
          border-radius:50%;
          background:${color};
          border:3px solid white;
          box-shadow:0 0 10px rgba(0,0,0,0.4);
        "
      ></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

export function LiveMapPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    api.get('/vehicles').then((response) => {
      setVehicles(response.data);
    });
  }, []);

  const authenticatedVehicles = vehicles.filter(
    (vehicle) => vehicle.status === 'Authenticated'
  ).length;

  const deniedVehicles = vehicles.filter(
    (vehicle) => vehicle.status === 'Denied'
  ).length;

  const pendingVehicles = vehicles.filter(
    (vehicle) => vehicle.status === 'Pending'
  ).length;

  return (
    <div className="live-map-page">
      <PageHeader
        title="Live Map"
        description="Real-time visualization of connected vehicles and V2I communication."
      />

      <div className="map-dashboard-grid">
        <div className="map-card">
          <div className="map-header">
            <div>
              <h2>Vehicle Positioning Map</h2>
              <p>Connected vehicles displayed by authentication status.</p>
            </div>

            <span className="live-indicator">● Live Monitoring</span>
          </div>

          <div className="map-wrapper">
            <MapContainer
              center={[44.4268, 26.1025]}
              zoom={12}
              scrollWheelZoom={true}
              className="siams-map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {vehicles.map((vehicle) => (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.lat, vehicle.lng]}
                  icon={createMarkerIcon(vehicle.status)}
                >
                  <Popup>
                    <div className="map-popup-content">
                      <strong>{vehicle.id}</strong>
                      <br />
                      Status: {vehicle.status}
                      <br />
                      Certificate: {vehicle.certificate}
                      <br />
                      RSU: {vehicle.rsu}
                      <br />
                      Speed: {vehicle.speed} km/h
                      <br />
                      Location: {vehicle.location}
                      <br />
                      Last Seen: {vehicle.lastSeen}
                      <br />

                      <button
                        type="button"
                        className="map-popup-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedVehicle(vehicle);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <aside className="map-side-panel">
          <div className="map-info-card">
            <h3>Map Overview</h3>

            <div className="map-stats-grid">
              <div className="map-stat">
                <span>Total Vehicles</span>
                <strong>{vehicles.length}</strong>
              </div>

              <div className="map-stat">
                <span>Authenticated</span>
                <strong>{authenticatedVehicles}</strong>
              </div>

              <div className="map-stat">
                <span>Denied</span>
                <strong>{deniedVehicles}</strong>
              </div>

              <div className="map-stat">
                <span>Pending</span>
                <strong>{pendingVehicles}</strong>
              </div>
            </div>
          </div>

          <div className="map-info-card">
            <h3>Legend</h3>

            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-dot authenticated"></span>
                Authenticated Vehicle
              </div>

              <div className="legend-item">
                <span className="legend-dot denied"></span>
                Denied Vehicle
              </div>

              <div className="legend-item">
                <span className="legend-dot pending"></span>
                Pending Vehicle
              </div>
            </div>
          </div>

          <div className="map-info-card">
            <h3>Live Vehicles</h3>

            <div className="map-vehicle-list">
              {vehicles.map((vehicle) => (
                <button
                  type="button"
                  key={vehicle.id}
                  className="map-vehicle-item"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="map-vehicle-item-top">
                    <strong>{vehicle.id}</strong>

                    <span
                      className={`vehicle-status-pill ${vehicle.status.toLowerCase()}`}
                    >
                      {vehicle.status}
                    </span>
                  </div>

                  <p>{vehicle.location}</p>
                  <p>
                    {vehicle.rsu} · {vehicle.speed} km/h
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {selectedVehicle && (
        <div className="vehicle-modal-overlay">
          <div className="vehicle-modal">
            <div className="vehicle-modal-header">
              <div>
                <h2>{selectedVehicle.id}</h2>
                <p>Connected Vehicle Profile</p>
              </div>

              <button
                type="button"
                className="vehicle-modal-close"
                onClick={() => setSelectedVehicle(null)}
              >
                ✕
              </button>
            </div>

            <div className="vehicle-modal-grid">
              <div>
                <span>Status</span>
                <strong>{selectedVehicle.status}</strong>
              </div>

              <div>
                <span>Certificate</span>
                <strong>{selectedVehicle.certificate}</strong>
              </div>

              <div>
                <span>RSU</span>
                <strong>{selectedVehicle.rsu}</strong>
              </div>

              <div>
                <span>Speed</span>
                <strong>{selectedVehicle.speed} km/h</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{selectedVehicle.location}</strong>
              </div>

              <div>
                <span>Last Seen</span>
                <strong>{selectedVehicle.lastSeen}</strong>
              </div>
            </div>

            <div className="vehicle-modal-note">
              <h3>Security Interpretation</h3>
              <p>
                This vehicle is monitored by SIAMS through V2I communication.
                Its certificate status and access behavior are used to determine
                whether the vehicle can be trusted by the infrastructure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}