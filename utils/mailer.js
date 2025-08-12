const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send a password reset email.
 * @param {string} to - Recipient email address
 * @param {string} resetLink - URL for resetting password
 */
exports.sendResetEmail = async (to, resetLink) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "ResiLinked Password Reset",
        html: `<p>I-click ang link na ito upang i-reset ang password mo: <a href="${resetLink}">Reset Password</a></p>`
    });
};

/**
 * Send a generic notification email (optional for admin or system messages)
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
exports.sendNotificationEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};