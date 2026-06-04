const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

const vehicles = [
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
  {
    id: 'VH-8891',
    status: 'Authenticated',
    speed: 62,
    location: 'Bucharest - Sector 6',
    rsu: 'RSU-02',
    lastSeen: '14:29:18',
    certificate: 'Valid',
  },
  {
    id: 'VH-4502',
    status: 'Pending',
    speed: 41,
    location: 'Bucharest - Sector 4',
    rsu: 'RSU-09',
    lastSeen: '14:27:55',
    certificate: 'Valid',
  },
];


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SIAMS backend is running');
});

app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    connectedVehicles: 1248,
    authenticatedVehicles: 1192,
    deniedRequests: 56,
    activeRSUs: 24,
  });
});

app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});


app.listen(PORT, () => {
  console.log(`SIAMS backend running on http://localhost:${PORT}`);
});