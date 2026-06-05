const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

const readData = () => {
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

app.use(cors());
app.use(express.json());

let data = readData();

let vehicles = data.vehicles;
let accessRequests = data.accessRequests;
let securityAlerts = data.securityAlerts;
let rsus = data.rsus;

const saveData = () => {
  writeData({
    vehicles,
    accessRequests,
    securityAlerts,
    rsus,
  });
};

// helper live map
const getCoordinatesByLocation = (location) => {
  const sectorCoordinates = {
    'Bucharest - Sector 1': {
      lat: 44.4595,
      lng: 26.0893,
    },
    'Bucharest - Sector 2': {
      lat: 44.4527,
      lng: 26.1381,
    },
    'Bucharest - Sector 3': {
      lat: 44.4231,
      lng: 26.1685,
    },
    'Bucharest - Sector 4': {
      lat: 44.4050,
      lng: 26.1250,
    },
    'Bucharest - Sector 5': {
      lat: 44.4017,
      lng: 26.0826,
    },
    'Bucharest - Sector 6': {
      lat: 44.4388,
      lng: 26.0412,
    },
  };

  const selectedLocation =
    sectorCoordinates[location] ||
    sectorCoordinates['Bucharest - Sector 1'];

  return {
    lat: selectedLocation.lat + (Math.random() - 0.5) * 0.015,
    lng: selectedLocation.lng + (Math.random() - 0.5) * 0.015,
  };
};

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
  const { search, status, rsu } = req.query;

  let filteredRequests = accessRequests;

  if (search) {
    filteredRequests = filteredRequests.filter((request) =>
      request.vehicleId.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status) {
    filteredRequests = filteredRequests.filter(
      (request) => request.status === status
    );
  }

  if (rsu) {
    filteredRequests = filteredRequests.filter(
      (request) => request.rsuId === rsu
    );
  }

  res.json(filteredRequests);
});

app.get('/api/security-alerts', (req, res) => {
  const { search, severity, rsu } = req.query;

  let filteredAlerts = securityAlerts;

  if (search) {
    filteredAlerts = filteredAlerts.filter((alert) =>
      alert.vehicleId.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (severity) {
    filteredAlerts = filteredAlerts.filter(
      (alert) => alert.severity === severity
    );
  }

  if (rsu) {
    filteredAlerts = filteredAlerts.filter(
      (alert) => alert.rsuId === rsu
    );
  }

  res.json(filteredAlerts);
});

app.get('/api/dashboard/activity', (req, res) => {
  const latestRequests = accessRequests.slice(0, 5);

  res.json(latestRequests);
});

app.post('/api/access-requests/simulate', (req, res) => {
  const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

  let status = 'Granted';
  let reason = 'Vehicle authenticated successfully';

  const randomNumber = Math.random();

  if (randomVehicle.certificate === 'Expired') {
    status = 'Denied';
    reason = 'Expired certificate';
  } else if (randomNumber < 0.25) {
    status = 'Pending';
    reason = 'Additional validation required';
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
    const existingAlert = securityAlerts.find(
      (alert) => alert.vehicleId === randomVehicle.id
    );

    if (!existingAlert) {
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
      saveData();
    }
  }

  saveData();

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
  const authenticatedVehicles = vehicles.filter(
    (vehicle) => vehicle.status === 'Authenticated'
  ).length;

  const deniedVehicles = vehicles.filter(
    (vehicle) => vehicle.status === 'Denied'
  ).length;

  const pendingVehicles = vehicles.filter(
    (vehicle) => vehicle.status === 'Pending'
  ).length;

  const validCertificates = vehicles.filter(
    (vehicle) => vehicle.certificate === 'Valid'
  ).length;

  const expiredCertificates = vehicles.filter(
    (vehicle) => vehicle.certificate === 'Expired'
  ).length;

  res.json({
    totalVehicles: vehicles.length,
    authenticatedVehicles,
    deniedVehicles,
    pendingVehicles,
    validCertificates,
    expiredCertificates,
    totalRequests: accessRequests.length,
    totalAlerts: securityAlerts.length,
  });
});

app.post('/api/vehicles', (req, res) => {
  const { id, speed, location, rsu, certificate } = req.body;

  if (!id || !location || speed === undefined || !rsu || !certificate) {
    return res.status(400).json({
      message: 'All fields are required.',
    });
  }

  if (Number(speed) < 0) {
    return res.status(400).json({
      message: 'Speed cannot be negative.',
    });
  }

  const vehicleAlreadyExists = vehicles.some(
    (vehicle) => vehicle.id.toLowerCase() === id.toLowerCase()
  );

  if (vehicleAlreadyExists) {
    return res.status(409).json({
      message: 'Vehicle ID already exists.',
    });
  }

  const coordinates = getCoordinatesByLocation(location);

  const newVehicle = {
    id,
    status: certificate === 'Expired' ? 'Denied' : 'Authenticated',
    speed: Number(speed),
    location,
    rsu,
    lastSeen: new Date().toLocaleTimeString('en-GB'),
    certificate,
    lat: coordinates.lat,
    lng: coordinates.lng,
  };

  vehicles = [newVehicle, ...vehicles];

  saveData();

  res.status(201).json(newVehicle);
});

app.delete('/api/security-alerts/:id', (req, res) => {
  const alertId = Number(req.params.id);

  securityAlerts = securityAlerts.filter((alert) => alert.id !== alertId);

  saveData();

  res.status(204).send();
});

app.delete('/api/vehicles/:id', (req, res) => {
  const vehicleId = req.params.id;

  vehicles = vehicles.filter(
    (vehicle) => vehicle.id !== vehicleId
  );

  saveData();

  res.status(204).send();
});

app.put('/api/vehicles/:id/toggle-certificate', (req, res) => {
  const vehicleId = req.params.id;

  const vehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);

  if (!vehicle) {
    res.status(404).json({ message: 'Vehicle not found' });
    return;
  }

  vehicle.certificate =
    vehicle.certificate === 'Valid' ? 'Expired' : 'Valid';

  vehicle.status =
    vehicle.certificate === 'Expired' ? 'Denied' : 'Authenticated';

  vehicle.lastSeen = new Date().toLocaleTimeString('en-GB');

  res.json(vehicle);
});

app.delete('/api/security-alerts/:id', (req, res) => {
  const alertId = Number(req.params.id);

  securityAlerts = securityAlerts.filter((alert) => alert.id !== alertId);

  saveData();

  res.status(204).send();
});

app.get('/api/rsus', (req, res) => {
  const updatedRsus = rsus.map((rsu) => {
    const connectedVehicles = vehicles.filter(
      (vehicle) => vehicle.rsu === rsu.id
    ).length;

    const deniedVehicles = vehicles.filter(
      (vehicle) =>
        vehicle.rsu === rsu.id &&
        vehicle.status === 'Denied'
    ).length;

    const pendingVehicles = vehicles.filter(
      (vehicle) =>
        vehicle.rsu === rsu.id &&
        vehicle.status === 'Pending'
    ).length;

    let health =
      100 -
      deniedVehicles * 15 -
      pendingVehicles * 5;

    if (health < 0) {
      health = 0;
    }

    const status =
      health >= 85
        ? 'Online'
        : health >= 65
          ? 'Warning'
          : 'Offline';

    return {
      ...rsu,
      connectedVehicles,
      deniedVehicles,
      pendingVehicles,
      health,
      status,
      lastSignal: new Date().toLocaleTimeString('en-GB'),
    };
  });

  res.json(updatedRsus);
});


app.put('/api/access-requests/:id/approve', (req, res) => {
  const requestId = Number(req.params.id);

  const request = accessRequests.find((request) => request.id === requestId);

  if (!request) {
    return res.status(404).json({ message: 'Access request not found.' });
  }

  request.status = 'Granted';
  request.reason = 'Manually approved by administrator';

  const vehicle = vehicles.find(
    (vehicle) => vehicle.id === request.vehicleId
  );

  if (vehicle) {
    vehicle.status = 'Authenticated';
    vehicle.certificate = 'Valid';
    vehicle.lastSeen = new Date().toLocaleTimeString('en-GB');
  }

  saveData();

  res.json(request);
});

app.put('/api/access-requests/:id/reject', (req, res) => {
  const requestId = Number(req.params.id);

  const request = accessRequests.find((request) => request.id === requestId);

  if (!request) {
    return res.status(404).json({
      message: 'Access request not found.',
    });
  }

  request.status = 'Denied';
  request.reason = 'Manually rejected by administrator';

  const vehicle = vehicles.find(
    (vehicle) => vehicle.id === request.vehicleId
  );

  if (vehicle) {
    vehicle.status = 'Denied';
    vehicle.lastSeen = new Date().toLocaleTimeString('en-GB');
  }

  const existingAlert = securityAlerts.find(
    (alert) => alert.vehicleId === request.vehicleId
  );

  if (existingAlert) {
    existingAlert.timestamp = new Date().toLocaleTimeString('en-GB');
    existingAlert.description = `Vehicle ${request.vehicleId} was manually rejected again by the administrator.`;
  } else {
    const newAlert = {
      id: securityAlerts.length + 1,
      title: 'Manual Access Rejection',
      vehicleId: request.vehicleId,
      rsuId: request.rsuId,
      severity: 'High',
      timestamp: new Date().toLocaleTimeString('en-GB'),
      description: `Vehicle ${request.vehicleId} was manually rejected by the administrator.`,
    };

    securityAlerts = [newAlert, ...securityAlerts];
  }

  saveData();

  res.json(request);
});

app.listen(PORT, () => {
  console.log(`SIAMS backend running on http://localhost:${PORT}`);
});