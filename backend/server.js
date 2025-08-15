const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './env.config' });

const db = require('./config/database');
const authRoutes = require('./routes/auth');
const bikeRoutes = require('./routes/bikes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make database available to routes
app.locals.db = db;

// Routes
app.use('/auth', authRoutes);
app.use('/bikes', bikeRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mini Vutto API is running!',
    endpoints: {
      auth: '/auth',
      bikes: '/bikes'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  db.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  db.end();
  process.exit(0);
});

