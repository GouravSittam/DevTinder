const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.Cloudinary_CLOUD_NAME,
    api_key: process.env.Cloudinary_API_KEY,
    api_secret: process.env.Cloudinary_API_SECRET
});

// Allowed MIME types
const allowedMimeTypes = [
    'image/png',
    'image/jpeg', // covers both .jpeg and .jpg
    'image/webp',
    'image/heic', // iPhone images (newer)
    'image/heif'  // iPhone HEIF format
];

// Multer with memory storage and file filter
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PNG, JPEG, JPG, WebP, and iPhone formats are allowed.'));
        }
    }
});

// Helper function to upload buffer to cloudinary and return the URL
// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                folder: 'DevConnects' // optional folder
            },
            (error, result) => {
                if (error) {
                    return reject(new Error('Cloudinary upload failed for profile picture'));
                }
                resolve(result.secure_url); // Return only the URL
            }
        );
        stream.end(fileBuffer); // Send buffer to Cloudinary
    });
};

module.exports = {
    cloudinary,
    upload, 
    uploadToCloudinary
}

