// server/models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    // We link the profile to the MySQL user ID
    // Storing it as a String because Mongoose's default _id is ObjectId (string-like)
    userId: {
        type: String, // Corresponds to the MySQL user's `id`
        required: true,
        unique: true
    },
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [150, 'Age cannot exceed 150']
    },
    dateOfBirth: {
        type: Date
    },
    contactInformation: {
        type: String,
        trim: true, // Remove whitespace from both ends
        // Example: Basic email validation regex if contact info is always email
        // match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the `updatedAt` field on every save
ProfileSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

ProfileSchema.pre('findOneAndUpdate', function(next) {
    this._update.updatedAt = Date.now();
    next();
});


// Create and export the Profile model
module.exports = mongoose.model('Profile', ProfileSchema);