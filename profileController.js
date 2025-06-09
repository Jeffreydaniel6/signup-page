// server/controllers/profileController.js
const Profile = require('../models/Profile'); // MongoDB Profile Model
const { query } = require('../config/db'); // MySQL query helper for getting username

// @route   GET /api/profile
// @desc    Get user profile (requires authentication)
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        // req.user.id is set by authMiddleware from the JWT payload (MySQL user ID)
        const userId = req.user.id;

        // Fetch username from MySQL 'users' table
        const users = await query('SELECT username FROM users WHERE id = ?', [userId]);
        const username = users.length > 0 ? users[0].username : 'Unknown User';

        // Fetch profile details from MongoDB 'profiles' collection
        // Ensure userId is a string for MongoDB query matching
        const profile = await Profile.findOne({ userId: userId.toString() });

        if (!profile) {
            // This shouldn't happen if profile is created on registration, but good for robustness
            return res.status(404).json({ message: 'Profile not found for this user.' });
        }

        // Respond with combined profile data
        res.json({
            username: username, // From MySQL
            age: profile.age,
            dateOfBirth: profile.dateOfBirth,
            contactInformation: profile.contactInformation
        });

    } catch (error) {
        console.error('Get profile error:', error.message);
        res.status(500).json({ message: 'Server error fetching profile.' });
    }
};

// @route   PUT /api/profile
// @desc    Update user profile (requires authentication)
// @access  Private
exports.updateProfile = async (req, res) => {
    const { age, dateOfBirth, contactInformation } = req.body;
    const userId = req.user.id; // From JWT payload (MySQL user ID)

    // Basic validation (more comprehensive validation can be added)
    if (age !== undefined && (isNaN(age) || age < 0 || age > 150)) {
        return res.status(400).json({ message: 'Age must be a number between 0 and 150.' });
    }
    if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
        return res.status(400).json({ message: 'Invalid Date of Birth format.' });
    }
    if (contactInformation && typeof contactInformation !== 'string') {
        return res.status(400).json({ message: 'Contact Information must be a string.' });
    }

    try {
        // Find and update the profile document in MongoDB
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: userId.toString() }, // Query to find the profile
            { age, dateOfBirth, contactInformation }, // Fields to update
            { new: true, runValidators: true } // Return the updated document, run Mongoose schema validators
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found or could not be updated.' });
        }

        res.json({ message: 'Profile updated successfully!', profile: updatedProfile });

    } catch (error) {
        console.error('Update profile error:', error.message);
        res.status(500).json({ message: 'Server error updating profile.' });
    }
};