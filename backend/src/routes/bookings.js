const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/jwt');
const { createBooking, listUserBookings } = require('../controllers/bookingController');

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, listUserBookings);

module.exports = router;
