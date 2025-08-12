const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Get current user's profile
router.get('/me', auth.verify, userController.getProfile);
// Edit own profile
router.put('/me', auth.verify, userController.editProfile);
// Set a goal (legacy, for backward-compat)
router.post('/goals', auth.verify, userController.setGoal);

module.exports = router;