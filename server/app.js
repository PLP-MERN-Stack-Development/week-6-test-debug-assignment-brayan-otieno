const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bugRoutes = require('./routes/bugRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bugs', bugRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bug Tracker API',
    endpoints: {
      bugs: '/api/bugs',
      createBug: '/api/bugs (POST)',
      updateBug: '/api/bugs/:id (PUT)',
      deleteBug: '/api/bugs/:id (DELETE)'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;
