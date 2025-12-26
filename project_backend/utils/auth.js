const jwt = require('jsonwebtoken')
const config = require('./config')
const result = require('./result')

function authUser(req, res, next) {
    // List of URLs that do NOT require a token
    const allAllowedUrls = [
        '/user/signin', 
        '/user/signup',
        '/course/all-active-courses' // <--- Add this line
    ]

    // Check if the current request URL matches any of the allowed URLs
    if (allAllowedUrls.includes(req.url)) {
        next() // Skip token check and proceed
    } else {
        const token = req.headers.token
        if (!token) {
            res.send(result.createResult('Token is missing'))
        } else {
            try {
                const payload = jwt.verify(token, config.SECRET)
                req.headers.uid = payload.uid
                req.headers.email = payload.email
                req.headers.role = payload.role
                next()
            } catch (ex) {
                res.send(result.createResult('Token is Invalid'))
            }
        }
    }
}

module.exports = authUser