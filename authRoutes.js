// server/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register); // Handles user registration
router.post('/login', login);       // Handles user login

module.exports = router;