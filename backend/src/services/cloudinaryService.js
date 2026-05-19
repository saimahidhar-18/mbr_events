const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(base64, opts = {}) {
  // base64 can be data URL or remote URL
  return cloudinary.uploader.upload(base64, opts);
}

module.exports = { uploadToCloudinary };
