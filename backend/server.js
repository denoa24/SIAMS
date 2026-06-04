const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let vehicles = [
  {
    id: 'VH-1024',
    status: 'Authenticated',
    speed: 48,
    location: 'Bucharest - Sector 1',
    rsu: 'RSU-04',
    lastSeen: '14:32:12',
    certificate: 'Valid',
  },
  {
    id: 'VH-2201',
    status: 'Denied',
    speed: 35,
    location: 'Bucharest - Sector 3',
    rsu: 'RSU-11',
    lastSeen: '14:31:04',
    certificate: 'Expired',
  },
];

let accessRequests = [];
let securityAlerts = [];

app.get('/', (req, res) => {
  res.send('SIAMS backend is running');
});

app.get('/api/vehicles', (req, res) => {
  const { search, status, rsu, certificate } = req.query;

  let filteredVehicles = vehicles;

  if (search) {
    filteredVehicles = filteredVehicles.filter((vehicle) =>
      vehicle.id.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status) {
    filteredVehicles = filteredVehicles.filter(
      (vehicle) => vehicle.status === status
    );
  }

  if (rsu) {
    filteredVehicles = filteredVehicles.filter(
      (vehicle) => vehicle.rsu === rsu
    );
  }

  if (certificate) {
    filteredVehicles = filteredVehicles.filter(
      (vehicle) => vehicle.certificate === certificate
    );
  }

  res.json(filteredVehicles);
});

app.get('/api/access-requests', (req, res) => {
  res.json(accessRequests);
});

app.get('/api/security-alerts', (req, res) => {
  res.json(securityAlerts);
});

app.get('/api/dashboard/activity', (req, res) => {
  const latestRequests = accessRequests.slice(0, 5);

  res.json(latestRequests);
});

app.post('/api/access-requests/simulate', (req, res) => {
  const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

  let status = 'Granted';
  let reason = 'Vehicle authenticated successfully';

  if (randomVehicle.certificate === 'Expired') {
    status = 'Denied';
    reason = 'Expired certificate';
  }

  const newRequest = {
    id: accessRequests.length + 1,
    vehicleId: randomVehicle.id,
    rsuId: randomVehicle.rsu,
    timestamp: new Date().toLocaleTimeString('en-GB'),
    status,
    reason,
  };

  accessRequests = [newRequest, ...accessRequests];

  if (newRequest.status === 'Denied') {
    const newAlert = {
      id: securityAlerts.length + 1,
      title: 'Unauthorized Access Attempt',
      vehicleId: randomVehicle.id,
      rsuId: randomVehicle.rsu,
      severity: 'Critical',
      timestamp: newRequest.timestamp,
      description: `Vehicle ${randomVehicle.id} was denied access due to: ${reason}.`,
    };

    securityAlerts = [newAlert, ...securityAlerts];
  }

  res.status(201).json(newRequest);
});

app.get('/api/dashboard/stats', (req, res) => {
  const connectedVehicles = vehicles.length;

  const authenticatedVehicles = accessRequests.filter(
    (request) => request.status === 'Granted'
  ).length;

  const deniedRequests = accessRequests.filter(
    (request) => request.status === 'Denied'
  ).length;

  const activeRSUs = new Set(vehicles.map((vehicle) => vehicle.rsu)).size;

  res.json({
    connectedVehicles,
    authenticatedVehicles,
    deniedRequests,
    activeRSUs,
  });
});

app.get('/api/analytics', (req, res) => {
  const totalRequests = accessRequests.length;

  const grantedRequests = accessRequests.filter(
    (request) => request.status === 'Granted'
  ).length;

  const deniedRequests = accessRequests.filter(
    (request) => request.status === 'Denied'
  ).length;

  const successRate =
    totalRequests === 0
      ? 0
      : Math.round((grantedRequests / totalRequests) * 100);

  const deniedRate =
    totalRequests === 0
      ? 0
      : Math.round((deniedRequests / totalRequests) * 100);

  res.json({
    totalRequests,
    grantedRequests,
    deniedRequests,
    successRate,
    deniedRate,
    totalVehicles: vehicles.length,
    totalAlerts: securityAlerts.length,
    activeRSUs: new Set(vehicles.map((vehicle) => vehicle.rsu)).size,
  });
});

app.post('/api/vehicles', (req, res) => {
  const { id, speed, location, rsu, certificate } = req.body;

  const newVehicle = {
    id,
    status: certificate === 'Expired' ? 'Denied' : 'Authenticated',
    speed,
    location,
    rsu,
    lastSeen: new Date().toLocaleTimeString('en-GB'),
    certificate,
  };

  vehicles = [newVehicle, ...vehicles];

  res.status(201).json(newVehicle);
});

app.listen(PORT, () => {
  console.log(`SIAMS backend running on http://localhost:${PORT}`);
});