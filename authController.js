// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db'); // MySQL query helper (uses prepared statements)
const Profile = require('../models/Profile'); // MongoDB Profile Model

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        // 1. Check if username already exists in MySQL
        const existingUsers = await query('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10); // Generate salt
        const password_hash = await bcrypt.hash(password, salt); // Hash password

        // 3. Insert user into MySQL 'users' table
        const result = await query(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [username, password_hash]
        );
        const userId = result.insertId; // Get the auto-incremented ID from MySQL

        // 4. Create a new, empty profile document in MongoDB 'profiles' collection
        // Link it using the MySQL userId
        const newProfile = new Profile({
            userId: userId.toString(), // Convert to string as MongoDB userId is string
            age: null, // Initial empty values
            dateOfBirth: null,
            contactInformation: null
        });
        await newProfile.save(); // Save the new profile to MongoDB

        // Respond with success
        res.status(201).json({ message: 'User registered successfully!', userId: userId });

    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // 1. Find user in MySQL 'users' table by username
        const users = await query('SELECT id, password_hash FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid Credentials.' }); // User not found
        }

        const user = users[0]; // Get the first (and only) user found

        // 2. Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials.' }); // Password mismatch
        }

        // 3. Create JWT payload (user ID from MySQL)
        const payload = {
            user: {
                id: user.id // This is the MySQL user ID, crucial for linking to profile
            }
        };

        // 4. Sign the JWT and send it back
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Secret from .env
            { expiresIn: '1h' }, // Token expiration time (e.g., 1 hour)
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send the JWT token to the frontend
            }
        );

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};