const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['Authenticated', 'Denied', 'Pending'],
    default: 'Authenticated',
  },
  speed: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rsu: {
    type: String,
    required: true,
  },
  lastSeen: {
    type: String,
    required: true,
  },
  certificate: {
    type: String,
    enum: ['Valid', 'Expired'],
    required: true,
  },
  lat: Number,
  lng: Number,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);