const result = require('./result');

function checkAdmin(req, res, next) {
    // authUser has already run, so we have the role in headers
    if (req.headers.role === 'admin') {
        next();
    } else {
        res.send(result.createResult("Access Denied: You are not an Admin"));
    }
}

module.exports = checkAdmin;