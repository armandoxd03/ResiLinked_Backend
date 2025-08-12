const User = require('../models/User');
const Job = require('../models/Job');
const Rating = require('../models/Rating');

exports.barangayStats = async (req, res) => {
    try {
        const { barangay } = req.query;
        const users = await User.find({ barangay });
        const jobs = await Job.find({ barangay });
        const male = users.filter(u => u.gender === 'male').length;
        const female = users.filter(u => u.gender === 'female').length;
        const topSkills = {};
        users.forEach(u => {
            (u.skills || []).forEach(skill => {
                topSkills[skill] = (topSkills[skill] || 0) + 1;
            });
        });
        res.status(200).json({
            totalUsers: users.length,
            totalJobs: jobs.length,
            male,
            female,
            topSkills: Object.entries(topSkills).sort((a, b) => b[1] - a[1])
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching barangay stats", error: err.message });
    }
};