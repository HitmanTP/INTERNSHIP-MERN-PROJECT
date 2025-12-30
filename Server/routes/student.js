const express = require('express');
const pool = require('../db/pool');
const result = require('../utils/result');
const authUser = require('../utils/auth');

const router = express.Router();

// Register to Course
router.post('/register-to-course', authUser, (req, res) => {
    // ---------------------------------------------------------
    // DEBUG LOGS (Check terminal when you click Enroll)
    // ---------------------------------------------------------
    console.log("------------------------------------------");
    console.log("ENROLL REQUEST RECEIVED");
    console.log("Token Payload (req.user):", req.user);
    
    // 1. Get User ID safely (Handles 'id' OR 'user_id')
    const userId = req.user.id || req.user.user_id;

    if (!userId) {
        console.log("ERROR: Token does not contain an ID!");
        return res.status(500).send(result.createResult("User ID missing from token"));
    }

    const { courseId } = req.body;
    console.log(`Enrolling User [${userId}] into Course [${courseId}]`);

    // 2. Check Database
    const checkSql = `SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?`;
    pool.query(checkSql, [userId, courseId], (error, data) => {
        if (error) {
            console.log("DB CHECK ERROR:", error);
            return res.send(result.createResult(error, data));
        } 
        
        if (data && data.length > 0) {
            console.log("User already enrolled.");
            return res.send(result.createResult("You have already enrolled in this course"));
        } 

        // 3. Insert Enrollment
        const insertSql = `INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)`;
        pool.query(insertSql, [userId, courseId], (insertError, insertData) => {
            if (insertError) {
                console.log("DB INSERT ERROR:", insertError);
                return res.send(result.createResult(insertError, insertData));
            }
            console.log("SUCCESS: Enrollment Saved!");
            res.send(result.createResult(null, insertData));
        });
    });
});

// Get My Courses
router.get('/my-courses', authUser, (req, res) => {
    // FIX: Match the ID logic here too
    const userId = req.user.id || req.user.user_id;
    
    const sql = `SELECT c.* FROM courses c 
                 JOIN enrollments e ON c.id = e.course_id 
                 WHERE e.user_id = ?`;
    pool.query(sql, [userId], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

module.exports = router;