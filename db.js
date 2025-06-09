// server/config/db.js
const mysql = require('mysql2/promise'); // Using the promise-based API for async/await
const mongoose = require('mongoose'); // Corrected from 'mongodb' to 'mongoose' for MongoDB connection

// Load environment variables from .env file (assuming it's in the server root)
require('dotenv').config({ path: '../.env' });

// --- MySQL Connection Pool ---
const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, // Ensure this matches DB_DATABASE in .env
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to test MySQL connection and create 'users' table if it doesn't exist
async function initializeMysql() {
    let connection;
    try {
        connection = await mysqlPool.getConnection();
        console.log('MySQL pool connected successfully!');

        // Create users table if it doesn't exist
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('MySQL users table checked/created successfully!');
    } catch (err) {
        console.error('MySQL connection or table creation error:', err);
        // Do NOT exit process immediately here, as MongoDB might still connect.
        // The calling script (server.js) should handle process exit if this is critical.
    } finally {
        if (connection) connection.release(); // Ensure connection is released
    }
}

// Helper function to execute MySQL queries using prepared statements
const query = async (sql, params) => {
    try {
        console.log('Executing MySQL query:', sql, params); // Added for debugging
        const [rows] = await mysqlPool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('MySQL query error:', error);
        throw error; // Re-throw to be caught by calling function
    }
};

// --- MongoDB Connection ---
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Do NOT exit process immediately here.
    }
};

module.exports = {
    query,             // Export the MySQL query helper
    connectMongoDB,    // Export the MongoDB connection function
    initializeMysql    // Export the MySQL initialization function
};