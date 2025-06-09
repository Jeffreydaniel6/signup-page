// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    // Expected format: "Authorization: Bearer <TOKEN>"
    const authHeader = req.header('Authorization');

    // Check if no token header is present
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Split the header to get the token part
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid token format. Expected "Bearer <token>"' });
    }

    const token = tokenParts[1]; // Get the actual JWT

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user payload (containing user ID) to the request object
        // This 'req.user' will be available in subsequent middleware/route handlers
        req.user = decoded.user;
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        console.error('JWT verification error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};