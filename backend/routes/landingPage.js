const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');
const LandingPageConfig = require('../models/LandingPageConfig');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const CloudinaryStorageModule = require('multer-storage-cloudinary');
const CloudinaryStorage = CloudinaryStorageModule.CloudinaryStorage || CloudinaryStorageModule;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'team-alpha-landing',
        resource_type: 'auto'
    },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        // Allowed formats
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, .jpeg, and .webp format allowed!'), false);
        }
    }
});

// @route   POST /api/landing-page/upload
// @desc    Upload an image for the landing page
// @access  Private/Admin
router.post('/upload', auth, isAdmin, upload.single('image'), (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Return the Cloudinary URL
        const fileUrl = req.file.path;
        res.json({ url: fileUrl });
    } catch (err) {
        console.error('Error uploading image:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/landing-page
// @desc    Get landing page configuration
// @access  Public
router.get('/', async (req, res) => {
    try {
        let config = await LandingPageConfig.findOne();
        if (!config) {
            // Create default config if it doesn't exist
            config = new LandingPageConfig({});
            await config.save();
        }
        res.json(config);
    } catch (err) {
        console.error('Error fetching landing page config:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/landing-page
// @desc    Update landing page configuration
// @access  Private/Admin
router.put('/', auth, isAdmin, async (req, res) => {
    try {

        let config = await LandingPageConfig.findOne();
        if (!config) {
            config = new LandingPageConfig({});
        }

        // Update fields based on request body
        const { hero, about, services, gallery, testimonials, contact } = req.body;
        
        if (hero) config.hero = hero;
        if (about) config.about = about;
        if (services) config.services = services;
        if (gallery) config.gallery = gallery;
        if (testimonials) config.testimonials = testimonials;
        if (contact) config.contact = contact;
        
        // Use markModified for Mixed types to ensure Mongoose saves changes
        config.markModified('hero');
        config.markModified('about');
        config.markModified('services');
        config.markModified('gallery');
        config.markModified('testimonials');
        config.markModified('contact');

        await config.save();
        res.json(config);
    } catch (err) {
        console.error('Error updating landing page config:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
