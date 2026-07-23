require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/antigravity_academy';

console.log('Connecting to MongoDB at:', MONGODB_URI);
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Please ensure the MongoDB service is running on your machine.');
  });

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/roadmaps', require('./routes/roadmaps'));
app.use('/api/editor', require('./routes/editor'));

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    service: 'Antigravity Academy Backend API'
  });
});

// Serve static assets in production (if required)
// for local testing we will run frontend and backend separately

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
