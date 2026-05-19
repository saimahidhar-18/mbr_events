const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const inventoryRoutes = require('./routes/inventory');
const galleryRoutes = require('./routes/gallery');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
