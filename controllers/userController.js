const User = require('../models/User');

// Get profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(user ? 200 : 404).json(user || { message: 'User not found' });
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
};

// Edit profile
exports.editProfile = async (req, res) => {
    try {
        const updates = req.body;
        // Optionally handle profilePicture or ID image update here
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
        res.status(user ? 200 : 404).json(user || { message: 'User not found' });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
};

// Set goal
exports.setGoal = async (req, res) => {
    try {
        const { targetAmount, description } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.goals.push({ targetAmount, description, progress: 0 });
        await user.save();
        res.status(200).json({ goals: user.goals });
    } catch (err) {
        res.status(500).json({ message: "Error setting goal", error: err.message });
    }
};