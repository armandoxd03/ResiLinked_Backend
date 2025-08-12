const Goal = require('../models/Goal');

// Create a new goal for the logged-in user
exports.createGoal = async (req, res) => {
    try {
        const { targetAmount, description } = req.body;
        const goal = new Goal({
            user: req.user.id,
            targetAmount,
            description,
            progress: 0,
            completed: false
        });
        await goal.save();
        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ message: "Error creating goal", error: err.message });
    }
};

// Get all goals for the logged-in user
exports.getMyGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });
        res.status(200).json(goals);
    } catch (err) {
        res.status(500).json({ message: "Error fetching goals", error: err.message });
    }
};

// Update a goal's progress or info
exports.updateGoal = async (req, res) => {
    try {
        const { progress, completed, targetAmount, description } = req.body;
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { progress, completed, targetAmount, description },
            { new: true }
        );
        if (!goal) return res.status(404).json({ message: "Goal not found" });
        res.status(200).json(goal);
    } catch (err) {
        res.status(500).json({ message: "Error updating goal", error: err.message });
    }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!goal) return res.status(404).json({ message: "Goal not found" });
        res.status(200).json({ message: "Goal deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting goal", error: err.message });
    }
};