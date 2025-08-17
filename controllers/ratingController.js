const Rating = require('../models/Rating');
const Job = require('../models/Job');
const { createNotification } = require('../utils/notificationHelper');

exports.rateUser = async (req, res) => {
    try {
        const { jobId, rateeId, rating, comment } = req.body;
        
        if (!jobId || !rateeId || !rating) {
            return res.status(400).json({
                message: "Missing required fields",
                required: ["jobId", "rateeId", "rating"],
                alert: "Please fill all required fields"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Invalid rating",
                alert: "Rating must be between 1 and 5"
            });
        }

        const exists = await Rating.findOne({ 
            job: jobId, 
            rater: req.user.id, 
            ratee: rateeId 
        });
        if (exists) {
            return res.status(400).json({ 
                message: "Already rated for this job",
                alert: "You've already rated this user for this job"
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ 
                message: "Job not found",
                alert: "The job you're rating for doesn't exist"
            });
        }

        const newRating = new Rating({ 
            job: jobId, 
            rater: req.user.id, 
            ratee: rateeId, 
            rating, 
            comment 
        });
        await newRating.save();

        // Notify the rated user
        await createNotification({
            recipient: rateeId,
            type: 'rating_received',
            message: `You received a ${rating}★ rating for job: ${job.title}`,
            relatedJob: jobId
        });

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: newRating,
            alert: "Rating submitted!"
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Error rating user", 
            error: err.message,
            alert: "Failed to submit rating"
        });
    }
};

exports.getRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ ratee: req.params.userId })
            .populate('rater', 'firstName lastName profilePicture')
            .populate('job', 'title')
            .sort({ createdAt: -1 });

        // Calculate average rating safely
        let averageRating = 0;
        if (ratings.length > 0) {
            const total = ratings.reduce((sum, r) => sum + r.rating, 0);
            averageRating = total / ratings.length;
        }

        res.status(200).json({
            ratings,
            stats: {
                totalRatings: ratings.length,
                averageRating: averageRating.toFixed(1),
                ratingDistribution: [1, 2, 3, 4, 5].map(star => ({
                    star,
                    count: ratings.filter(r => r.rating === star).length
                }))
            },
            alert: `Found ${ratings.length} ratings`
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching ratings", 
            error: err.message,
            alert: "Failed to load ratings"
        });
    }
};

exports.reportRating = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.ratingId);
        if (!rating) {
            return res.status(404).json({ 
                message: "Rating not found",
                alert: "No rating found with that ID"
            });
        }

        rating.reported = true;
        await rating.save();

        await createNotification({
            recipient: 'admin',
            type: 'rating_reported',
            message: `Rating ${req.params.ratingId} was reported as inappropriate`
        });

        res.status(200).json({ 
            message: "Rating reported",
            alert: "Rating reported to administrators"
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Error reporting rating", 
            error: err.message,
            alert: "Failed to report rating"
        });
    }
};