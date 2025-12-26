const express = require('express');
const cryptojs = require('crypto-js');
const pool = require('../db/pool');
const result = require('../utils/result');
const checkAdmin = require('../utils/checkAdmin');

const router = express.Router();

// Register to Course (Student)
router.post('/register-to-course', (req, res) => {
    const uid = req.headers.uid; 
    const { courseId } = req.body;
    const sql = `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`;
    pool.query(sql, [uid, courseId], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// Change Password (Student)
router.put('/change-password', (req, res) => {
    const uid = req.headers.uid;
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        return res.send(result.createResult("Passwords do not match"));
    }
    const hashedPassword = cryptojs.SHA256(newPassword).toString();
    const sql = `UPDATE users SET password = ? WHERE uid = ?`;
    pool.query(sql, [hashedPassword, uid], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// Get My Courses (Student)
router.get('/my-courses', (req, res) => {
    const uid = req.headers.uid;
    const sql = `SELECT c.* FROM courses c 
                 JOIN enrollments e ON c.course_id = e.course_id 
                 WHERE e.student_id = ?`;
    pool.query(sql, [uid], (error, data) => {
        res.send(result.createResult(error, data));
    });
});



// Get My Course Videos (Student)
router.get('/my-course-with-videos', (req, res) => {
    const uid = req.headers.uid;
    const sql = `SELECT c.course_name, v.title, v.youtube_url 
                 FROM courses c 
                 JOIN enrollments e ON c.course_id = e.course_id 
                 LEFT JOIN videos v ON c.course_id = v.course_id
                 WHERE e.student_id = ?`;
    pool.query(sql, [uid], (error, data) => {
        res.send(result.createResult(error, data));
    });
});