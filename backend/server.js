const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const serviceRoutes = require('./routes/serviceRoutes');
const guidelineRoutes = require('./routes/guidelineRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/guidelines', guidelineRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api', authRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/services.html'));
});

app.get('/guidelines', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/guidelines.html'));
});

app.get('/consultation', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/consultation.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
