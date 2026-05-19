const prisma = require('../utils/prisma');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { emit } = require('../socket');

async function listGallery(req, res, next) {
  try {
    const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ images });
  } catch (err) {
    next(err);
  }
}

async function uploadImages(req, res, next) {
  try {
    const { files, category } = req.body; // expect array of base64 or urls
    const uploaded = [];
    if (!files || !files.length) return res.status(400).json({ error: 'No files' });
    for (const f of files) {
      const { url, public_id } = await uploadToCloudinary(f, { folder: `mbr/${category || 'misc'}` });
      const rec = await prisma.galleryImage.create({ data: { url, publicId: public_id, category: category || 'uncategorized' } });
      uploaded.push(rec);
    }
    emit('galleryUpdated', uploaded);
    res.json({ uploaded });
  } catch (err) {
    next(err);
  }
}

module.exports = { listGallery, uploadImages };
