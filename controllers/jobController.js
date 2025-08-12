const Job = require('../models/Job');
const User = require('../models/User');
const { findMatchingJobs } = require('../utils/matchingEngine');

// Post job
exports.postJob = async (req, res) => {
    try {
        const job = new Job({ ...req.body, postedBy: req.user.id });
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: "Error posting job", error: err.message });
    }
};

// Get all jobs
exports.getAll = async (req, res) => {
    try {
        const jobs = await Job.find({ isOpen: true });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching jobs", error: err.message });
    }
};

// Get jobs matching user (AI)
exports.getMyMatches = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const jobs = await findMatchingJobs(user);
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching matches", error: err.message });
    }
};

// Apply for job
exports.applyJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        // Already applied?
        if (job.applicants.find(a => a.user.toString() === req.user.id)) {
            return res.status(400).json({ message: "Already applied" });
        }
        job.applicants.push({ user: req.user.id });
        await job.save();
        res.status(200).json({ message: "Applied" });
    } catch (err) {
        res.status(500).json({ message: "Error applying", error: err.message });
    }
};

// Assign worker to job (by employer)
exports.assignWorker = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not your job" });
        }
        job.assignedTo = req.body.userId;
        job.isOpen = false;
        // Mark applicant as accepted
        job.applicants = job.applicants.map(a =>
            a.user.toString() === req.body.userId
                ? { ...a.toObject(), status: 'accepted' }
                : { ...a.toObject(), status: 'rejected' }
        );
        await job.save();
        res.status(200).json({ message: "Worker assigned" });
    } catch (err) {
        res.status(500).json({ message: "Error assigning worker", error: err.message });
    }
};

// Filter/search jobs
exports.search = async (req, res) => {
    try {
        const { skill, barangay, sortBy='date', order='desc' } = req.query;
        let query = { isOpen: true };
        if (skill) query.skillsRequired = skill;
        if (barangay) query.barangay = barangay;
        let jobs = await Job.find(query);
        // Sorting
        if (sortBy === 'price') {
            jobs.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
        }
        if (sortBy === 'date') {
            jobs.sort((a, b) => order === 'asc' ? a.datePosted - b.datePosted : b.datePosted - a.datePosted);
        }
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Error searching jobs", error: err.message });
    }
};