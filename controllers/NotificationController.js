const Notification = require('../models/Notification');

// Get notifications for the logged-in user
exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications", error: err.message });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { isRead: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: "Notification not found" });
        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ message: "Error updating notification", error: err.message });
    }
};

// (Optional) Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
        if (!notification) return res.status(404).json({ message: "Notification not found" });
        res.status(200).json({ message: "Notification deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting notification", error: err.message });
    }
};