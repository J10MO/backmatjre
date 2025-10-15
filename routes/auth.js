// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { authLimiter } = require('../middleware/rateLimit');

// router.post('/auth/check-phone', authLimiter, authController.checkPhone);
// router.post('/auth/register', authLimiter, authController.register);
// router.post('/auth/verify', authLimiter, authController.verify);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { authenticateJWT } = require('../middleware/auth');
// const { authLimiter } = require('../middleware/rateLimit');

// // Main authentication endpoint (handles both login and register)
// router.post('/auth/phone', authLimiter, authController.handlePhone);

// // Alternative separate endpoints
// router.post('/auth/login', authLimiter, authController.login);
// router.post('/auth/register', authLimiter, authController.register);

// // Profile routes
// router.get('/auth/profile', authenticateJWT, authController.getProfile);
// router.put('/auth/profile', authenticateJWT, authController.updateProfile);

// module.exports = router;



const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

// Send OTP to phone number
router.post('/auth/send-otp', authLimiter, authController.sendOTP);

// Verify OTP and login/register
router.post('/auth/verify-otp', authLimiter, authController.verifyOTP);

// Resend OTP
router.post('/auth/resend-otp', authLimiter, authController.resendOTP);

// Profile routes
router.get('/auth/profile', authenticateJWT, authController.getProfile);
router.put('/auth/profile', authenticateJWT, authController.updateProfile);

module.exports = router;