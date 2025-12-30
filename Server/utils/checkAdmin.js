const result = require('./result');

function checkAdmin(req, res, next) {
    // FIX: Check req.user (decoded from token), NOT req.headers
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send(result.createResult("Access Denied: You are not an Admin"));
    }
}

module.exports = checkAdmin;