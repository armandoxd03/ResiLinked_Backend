const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Post a job (employer)
router.post('/', auth.verify, jobController.postJob);
// Get all open jobs
router.get('/', jobController.getAll);
// Get jobs matching logged-in user
router.get('/my-matches', auth.verify, jobController.getMyMatches);
// Apply to a job
router.post('/:id/apply', auth.verify, jobController.applyJob);
// Assign worker to a job (employer)
router.post('/:id/assign', auth.verify, jobController.assignWorker);
// Search/filter jobs
router.get('/search', jobController.search);

module.exports = router;