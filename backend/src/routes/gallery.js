const express = require('express');
const router = express.Router();
const { uploadImages, listGallery } = require('../controllers/galleryController');

router.get('/', listGallery);
router.post('/upload', uploadImages);

module.exports = router;
