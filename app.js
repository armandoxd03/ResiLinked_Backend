require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const goalRoutes = require('./routes/goalRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const passwordResetTokenRoutes = require('./routes/passwordResetTokenRoutes');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/resilinked";

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => console.log('✅ Connected to MongoDB'));

// App Initialization
const app = express();


// // CORS setup for dev/testing
app.use(cors({ origin: '*', credentials: false }));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving (uploaded images)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Main API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reset-tokens', passwordResetTokenRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    message: 'CORS is set to allow all origins (development mode)'
  });
});

// Error handler (always last)
app.use(errorHandler);

// Server listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(' CORS: Allowing all origins (development mode)');
  console.log(' Health check endpoint: /health');
});

module.exports = { app, mongoose };