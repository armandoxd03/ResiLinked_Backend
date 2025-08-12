const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

// Report a user
router.post('/', auth.verify, reportController.reportUser);
// Get all reports (admin)
router.get('/', auth.verify, reportController.getReports);
// Update report status (admin)
router.patch('/:id', auth.verify, reportController.updateReportStatus);

module.exports = router;