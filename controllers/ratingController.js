const Rating = require('../models/Rating');
const Job = require('../models/Job');

// Rate after job
exports.rateUser = async (req, res) => {
    try {
        const { jobId, rateeId, rating, comment } = req.body;
        // Prevent duplicate ratings
        const exists = await Rating.findOne({ job: jobId, rater: req.user.id, ratee: rateeId });
        if (exists) return res.status(400).json({ message: "Already rated for this job" });
        const newRating = new Rating({ job: jobId, rater: req.user.id, ratee: rateeId, rating, comment });
        await newRating.save();
        res.status(201).json(newRating);
    } catch (err) {
        res.status(500).json({ message: "Error rating user", error: err.message });
    }
};

// Get ratings for a user
exports.getRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ ratee: req.params.userId });
        res.status(200).json(ratings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching ratings", error: err.message });
    }
};

// Report a rating
exports.reportRating = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.ratingId);
        if (!rating) return res.status(404).json({ message: "Rating not found" });
        rating.reported = true;
        await rating.save();
        res.status(200).json({ message: "Rating reported" });
    } catch (err) {
        res.status(500).json({ message: "Error reporting rating", error: err.message });
    }
};