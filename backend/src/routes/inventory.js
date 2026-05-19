const express = require('express');
const router = express.Router();
const { listItems } = require('../controllers/inventoryController');

router.get('/', listItems);

module.exports = router;
