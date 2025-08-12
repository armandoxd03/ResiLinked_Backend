const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Dashboard summary
router.get('/dashboard', auth.verify, auth.verifyAdmin, adminController.getDashboard);
// Search/filter users
router.get('/users', auth.verify, auth.verifyAdmin, adminController.searchUsers);
// Delete user
router.delete('/users/:id', auth.verify, auth.verifyAdmin, adminController.deleteUser);
// Edit user
router.put('/users/:id', auth.verify, auth.verifyAdmin, adminController.editUser);
// Delete job
router.delete('/jobs/:id', auth.verify, auth.verifyAdmin, adminController.deleteJob);
// Edit job
router.put('/jobs/:id', auth.verify, auth.verifyAdmin, adminController.editJob);
// Download users as PDF
router.get('/users/download/pdf', auth.verify, auth.verifyAdmin, adminController.downloadUsersPdf);

module.exports = router;