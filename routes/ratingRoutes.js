const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');

// Rate a user after job
router.post('/', auth.verify, ratingController.rateUser);
// Get all ratings for a user
router.get('/:userId', ratingController.getRatings);
// Report a rating as inappropriate
router.post('/:ratingId/report', auth.verify, ratingController.reportRating);

module.exports = router;