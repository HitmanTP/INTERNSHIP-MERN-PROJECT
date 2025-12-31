const express = require('express');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const result = require('../utils/result');
const config = require('../utils/config');
const checkAdmin = require('../utils/checkAdmin'); 
const authUser = require('../utils/auth');

const router = express.Router();

// 1. Register (Signup)
router.post('/signup', (req, res) => {
    const { name, email, password, mobile, role } = req.body;
    
    // Check if role was sent, otherwise default to 'student'
    const userRole = (role === 'admin') ? 'admin' : 'student';
    
    const hashedPassword = cryptojs.SHA256(password).toString();
    
    const sql = `INSERT INTO users(name, email, password, mobile, role) VALUES (?,?,?,?,?)`;
    pool.query(sql, [name, email, hashedPassword, mobile, userRole], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// 2. Login (Signin)
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
            // Fix for inconsistent ID names (id vs user_id)
            const userId = user.id || user.user_id; 
            
            const payload = { 
                id: userId, 
                email: user.email, 
                role: user.role 
            };
            
            const token = jwt.sign(payload, config.SECRET);
            
            res.send(result.createResult(null, { 
                token, 
                name: user.name, 
                role: user.role,
                mobile: user.mobile
            }));
        }
    });
});

// 3. GET ALL STUDENTS (Needed for Admin "Student List" Page)
router.get('/all-students', authUser, checkAdmin, (req, res) => {
    const sql = `
        SELECT u.id, u.name, u.email, u.mobile, c.title as course_name
        FROM users u
        LEFT JOIN enrollments e ON u.id = e.user_id
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE u.role = 'student'
    `;
    pool.query(sql, (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// 4. Change Password
router.put('/change-password', authUser, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // Get user ID from the token (authUser middleware adds this)
    const userId = req.user.id || req.user.user_id;

    const hashedOldPassword = cryptojs.SHA256(oldPassword).toString();

    // Verify Old Password
    const checkSql = `SELECT * FROM users WHERE id = ? AND password = ?`;
    pool.query(checkSql, [userId, hashedOldPassword], (error, data) => {
        if (error) {
            return res.send(result.createResult(error));
        }
        
        if (data.length === 0) {
            return res.send(result.createResult("Old password does not match"));
        }

        // Update to New Password
        const hashedNewPassword = cryptojs.SHA256(newPassword).toString();
        const updateSql = `UPDATE users SET password = ? WHERE id = ?`;
        
        pool.query(updateSql, [hashedNewPassword, userId], (updateError, updateData) => {
            if (updateError) {
                res.send(result.createResult(updateError));
            } else {
                res.send(result.createResult(null, "Password changed successfully"));
            }
        });
    });
});

module.exports = router;