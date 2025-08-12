const PasswordResetToken = require('../models/PasswordResetToken');
const User = require('../models/User');

// For admin: List all reset tokens (optional, usually for audit/cleanup)
exports.getAllTokens = async (req, res) => {
    try {
        const tokens = await PasswordResetToken.find().populate('user', 'email firstName lastName');
        res.status(200).json(tokens);
    } catch (err) {
        res.status(500).json({ message: "Error fetching tokens", error: err.message });
    }
};

// For admin: Delete a password reset token
exports.deleteToken = async (req, res) => {
    try {
        const token = await PasswordResetToken.findByIdAndDelete(req.params.id);
        if (!token) return res.status(404).json({ message: "Token not found" });
        res.status(200).json({ message: "Token deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting token", error: err.message });
    }
};

// For admin: Mark a token as used manually (optional)
exports.markAsUsed = async (req, res) => {
    try {
        const token = await PasswordResetToken.findById(req.params.id);
        if (!token) return res.status(404).json({ message: "Token not found" });
        token.used = true;
        await token.save();
        res.status(200).json(token);
    } catch (err) {
        res.status(500).json({ message: "Error updating token", error: err.message });
    }
};