const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "mj9jb9ik",
    api_key: process.env.CLOUD_API_KEY || "255973885311815",
    api_secret: process.env.CLOUD_API_SECRET || "zuMw_z1BXY7LR7i7iMXzANKTkY8",
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ["png", "jpg", "jpeg"], 
    },
});

module.exports = {
    cloudinary,
    storage
};