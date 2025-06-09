// server/app.js
const express = require('express');
const cors = require('cors'); // Import CORS middleware
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// --- Middleware ---
// Body parser for JSON requests
app.use(express.json());
// Body parser for URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// CORS configuration: Allow requests from your React frontend
app.use(cors({
    origin: process.env.CLIENT_URL, // Dynamically get client URL from .env
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow sending cookies/auth headers (though we use localStorage)
}));

// --- Route Middlewares ---
// All routes starting with /api/auth will be handled by authRoutes
app.use('/api/auth', authRoutes);
// All routes starting with /api/profile (or just /api as in this case) will be handled by profileRoutes
app.use('/api', profileRoutes); // You can choose '/api/profile' if you prefer

// --- Basic Test Route (Optional) ---
// To confirm the server is running when you visit the root URL
app.get('/', (req, res) => {
    res.send('Node.js Backend is running!');
});

// --- Error Handling Middleware (Optional but Recommended for Production) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke on the server!');
});

module.exports = app;