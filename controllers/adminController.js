const User = require('../models/User');
const Job = require('../models/Job');
const Rating = require('../models/Rating');
const Report = require('../models/Report');
const { generateUserReport } = require('../utils/pdfGenerator');

// Dashboard summary
exports.getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalRatings = await Rating.countDocuments();
        const totalReports = await Report.countDocuments();
        // Additional stats as needed
        res.status(200).json({ totalUsers, totalJobs, totalRatings, totalReports });
    } catch (err) {
        res.status(500).json({ message: "Dashboard error", error: err.message });
    }
};

// Search/filter users/jobs/employers/employees
exports.searchUsers = async (req, res) => {
    try {
        const { q, sortBy = 'lastName', order = 'asc' } = req.query;
        let query = {};
        if (q) query.$or = [
            { firstName: new RegExp(q, 'i') },
            { lastName: new RegExp(q, 'i') },
            { email: new RegExp(q, 'i') }
        ];
        let users = await User.find(query);
        users.sort((a, b) => order === 'asc' ? (a[sortBy] > b[sortBy]) - (a[sortBy] < b[sortBy]) : (b[sortBy] > a[sortBy]) - (b[sortBy] < a[sortBy]));
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error searching users", error: err.message });
    }
};
// Delete user/job
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
};
exports.deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Job deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting job", error: err.message });
    }
};
// Edit user/job
exports.editUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error editing user", error: err.message });
    }
};
exports.editJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: "Error editing job", error: err.message });
    }
};

// Download users as PDF
exports.downloadUsersPdf = async (req, res) => {
    try {
        const users = await User.find();
        const filename = generateUserReport(users);
        res.download(filename);
    } catch (err) {
        res.status(500).json({ message: "Error generating PDF", error: err.message });
    }
};