// server/server.js
require('dotenv').config(); // Load environment variables from .env file immediately

const app = require('./app'); // Import the Express application configuration
const { connectMongoDB, initializeMysql } = require('./config/db'); // Import MongoDB and MySQL connection/initialization functions

const PORT = process.env.PORT || 5000; // Use the PORT from .env or default to 5000

// Initialize database connections
initializeMysql(); // Call the MySQL initialization function
connectMongoDB(); // Call the MongoDB connection function

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access backend at http://localhost:${PORT}`);
});