// server/routes/profileRoutes.js
const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); // Import our JWT authentication middleware

const router = express.Router();

// Protected routes (require JWT authentication)
router.get('/profile', authMiddleware, getProfile);       // Get user profile data
router.put('/profile', authMiddleware, updateProfile);    // Update user profile data

module.exports = router;