const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Barangay-level stats
router.get('/barangay', auth.verify, dashboardController.barangayStats);

module.exports = router;