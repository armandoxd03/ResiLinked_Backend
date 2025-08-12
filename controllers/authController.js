const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createAccessToken } = require('../middleware/auth');
const { sendResetEmail } = require('../utils/mailer');

exports.register = async (req, res) => {
    try {
        // Duplicate email check
        const existing = await User.findOne({ email: req.body.email });
        if (existing) return res.status(400).json({ message: "Email already registered" });
        
        // Hash password
        const hashed = bcrypt.hashSync(req.body.password, 10);
        // Save ID images path if uploaded
        const idFrontImage = req.files?.idFrontImage?.[0]?.path || '';
        const idBackImage = req.files?.idBackImage?.[0]?.path || '';
        // Create user
        const user = new User({
            ...req.body,
            password: hashed,
            idFrontImage,
            idBackImage,
            isVerified: false
        });
        await user.save();
        res.status(201).json({ message: "Registration successful, pending verification" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "User not found" });
        const valid = bcrypt.compareSync(req.body.password, user.password);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });
        const token = createAccessToken(user);
        res.status(200).json({ token, userId: user._id, userType: user.userType, isVerified: user.isVerified });
    } catch (err) {
        res.status(500).json({ message: "Login error", error: err.message });
    }
};

// Password reset request (send email)
exports.resetRequest = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "Email not found" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30m" });
        const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        await sendResetEmail(user.email, link);
        res.status(200).json({ message: "Check your email for reset instructions" });
    } catch (err) {
        res.status(500).json({ message: "Error sending reset email", error: err.message });
    }
};

// Password reset (with token)
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password updated" });
    } catch (err) {
        res.status(400).json({ message: "Invalid or expired reset token", error: err.message });
    }
};