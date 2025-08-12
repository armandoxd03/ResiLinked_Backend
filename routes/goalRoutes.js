const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

// Create a new goal
router.post('/', auth.verify, goalController.createGoal);
// Get all goals for current user
router.get('/', auth.verify, goalController.getMyGoals);
// Update a goal
router.put('/:id', auth.verify, goalController.updateGoal);
// Delete a goal
router.delete('/:id', auth.verify, goalController.deleteGoal);

module.exports = router;