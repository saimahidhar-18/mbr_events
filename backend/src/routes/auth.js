const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp, me } = require('../controllers/authController');
const { authMiddleware } = require('../utils/jwt');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', authMiddleware, me);

module.exports = router;
