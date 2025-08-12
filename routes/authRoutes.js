const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const idUpload = require('../middleware/upload');
const { registerValidation } = require('../middleware/validate');

// Registration (with ID image upload & validation)
router.post('/register', idUpload.fields([
  { name: 'idFrontImage' }, 
  { name: 'idBackImage' }
]), registerValidation, authController.register);
// Login
router.post('/login', authController.login);
// Password reset request (send email)
router.post('/reset/request', authController.resetRequest);
// Password reset (using token)
router.post('/reset', authController.resetPassword);

module.exports = router;