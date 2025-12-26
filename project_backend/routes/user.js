const express = require('express');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const result = require('../utils/result');
const config = require('../utils/config');

const router = express.Router();

router.post('/signup', (req, res) => {
    // 1. Accept 'role' from the request body
    const { name, email, password, mobile, role } = req.body;
    
    // 2. Check if a role was sent, otherwise default to 'student'
    // This allows you to send "admin", but if you send nothing, they become a student.
    const userRole = (role === 'admin') ? 'admin' : 'student';

    // 3. Update SQL to include the 'role' column
    const sql = `INSERT INTO users(name, email, password, mobile, role) VALUES (?,?,?,?,?)`;
    
    const hashedPassword = cryptojs.SHA256(password).toString();
    
    // 4. Pass 'userRole' to the query parameters
    pool.query(sql, [name, email, hashedPassword, mobile, userRole], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = cryptojs.SHA256(password).toString();
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    
    pool.query(sql, [email, hashedPassword], (error, data) => {
        if (error) {
            res.send(result.createResult(error));
        } else if (data.length === 0) {
            res.send(result.createResult("Invalid email or password"));
        } else {
            const user = data[0];
            
            // PAYLOAD: Include the role here!
            const payload = {
                uid: user.uid,
                email: user.email,
                role: user.role 
            };
            
            const token = jwt.sign(payload, config.SECRET);
            res.send(result.createResult(null, { 
                token, 
                name: user.name, 
                role: user.role 
            }));
        }
    });
});

module.exports = router;