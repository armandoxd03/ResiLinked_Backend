const Report = require('../models/Report');

// Report a user
exports.reportUser = async (req, res) => {
    try {
        const { reportedUserId, reason } = req.body;
        const report = new Report({ reporter: req.user.id, reportedUser: reportedUserId, reason });
        await report.save();
        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ message: "Error reporting user", error: err.message });
    }
};

// Get reports (admin)
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('reporter reportedUser');
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reports", error: err.message });
    }
};

// Resolve/dismiss report
exports.updateReportStatus = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: "Report not found" });
        report.status = req.body.status;
        await report.save();
        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({ message: "Error updating report", error: err.message });
    }
};