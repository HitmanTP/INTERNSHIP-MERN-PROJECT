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

