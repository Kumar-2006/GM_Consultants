const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
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
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'gm-consultants-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Suppress favicon 404 error
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Protect admin view route
const ensureAuthenticated = (req, res, next) => {
  if (req.session?.adminId) {
    return next();
  }
  return res.redirect('/login');
};

// API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/guidelines', guidelineRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api', authRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/services', (req, res) => {
  res.render('services');
});

app.get('/guidelines', (req, res) => {
  res.render('guidelines');
});

app.get('/consultation', (req, res) => {
  res.render('consultation');
});

app.get('/admin', ensureAuthenticated, (req, res) => {
  res.render('admin', { adminUsername: req.session.username });
});

app.get('/login', (req, res) => {
  if (req.session?.adminId) {
    return res.redirect('/admin');
  }
  res.render('login');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
