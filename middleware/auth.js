const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = process.env.JWT_SECRET || "resilinked-secret";

exports.verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "No token provided" });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
};

exports.verifyAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user || user.userType !== 'admin') {
        return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
};

exports.createAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, userType: user.userType }, secret, { expiresIn: '12h' });
};