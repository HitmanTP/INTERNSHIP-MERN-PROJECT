const express = require('express');
const pool = require('../db/pool');
const result = require('../utils/result');
const checkAdmin = require('../utils/checkAdmin'); // Import Admin Check
const router = express.Router();

// Public: Get Active Courses
router.get('/all-active-courses', (req, res) => {
    const sql = `SELECT * FROM courses WHERE end_date >= CURDATE()`;
    pool.query(sql, (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// ADMIN ONLY: Get All Courses (with optional filters)
router.get('/all-courses', checkAdmin, (req, res) => {
    const { startDate, endDate } = req.query;
    let sql = `SELECT * FROM courses`;
    const params = [];
    if (startDate && endDate) {
        sql += ` WHERE start_date >= ? AND end_date <= ?`;
        params.push(startDate, endDate);
    }
    pool.query(sql, params, (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// ADMIN ONLY: Add Course
router.post('/add', checkAdmin, (req, res) => {
    const { courseName, description, fees, startDate, endDate, videoExpireDays } = req.body;
    const sql = `INSERT INTO courses (course_name, description, fees, start_date, end_date, video_expire_days) VALUES (?, ?, ?, ?, ?, ?)`;
    pool.query(sql, [courseName, description, fees, startDate, endDate, videoExpireDays], (error, data) => {
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

// ADMIN ONLY: Get Enrolled Students
router.get('/admin/enrolled-students', checkAdmin, (req, res) => {
    const { courseId } = req.query;
    const sql = `SELECT u.name, u.email, u.mobile 
                 FROM users u 
                 JOIN enrollments e ON u.uid = e.student_id 
                 WHERE e.course_id = ?`;
    pool.query(sql, [courseId], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

module.exports = router;