const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Get own notifications
router.get('/', auth.verify, notificationController.getMyNotifications);
// Mark notification as read
router.patch('/:id/read', auth.verify, notificationController.markAsRead);
// Delete notification
router.delete('/:id', auth.verify, notificationController.deleteNotification);

module.exports = router;