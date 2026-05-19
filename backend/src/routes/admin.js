const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../utils/jwt');
const { updateInventory, listAll } = require('../controllers/adminController');

// Protected admin endpoints
router.use(authMiddleware, adminMiddleware);

router.get('/stats', (req, res) => {
  res.json({ bookings: 0, revenue: 0 });
});

// Inventory management
router.get('/inventory', listAll);
router.put('/inventory/:id', updateInventory);

module.exports = router;
