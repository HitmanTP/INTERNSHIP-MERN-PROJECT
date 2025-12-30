const jwt = require('jsonwebtoken');
const config = require('./config'); // Same folder
const result = require('./result');

function verifyToken(request, response, next) {
    const token = request.headers['token'];

    // DEBUG LOGS
    console.log("--- AUTH DEBUG ---");
    console.log("1. Token Received:", token);

    if (!token) {
        console.log("2. Error: No token found");
        return response.status(401).send(result.createResult("Token is missing"));
    }

    try {
        // CRITICAL FIX: Use 'config.SECRET' to match your Login Route
        const payload = jwt.verify(token, config.SECRET);
        
        console.log("2. Token Decoded:", payload);
        
        // Attach user info to the request so student.js can use it
        request.user = payload; 
        
        next(); // Proceed to the next step (student.js)
    } catch (ex) {
        console.log("2. Error: Token verification failed:", ex.message);
        return response.status(401).send(result.createResult("Invalid Token"));
    }
}

module.exports = verifyToken;