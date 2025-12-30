const express = require('express');
const pool = require('../db/pool');
const result = require('../utils/result');
const authUser = require('../utils/auth');
const checkAdmin = require('../utils/checkAdmin');

const router = express.Router();

// FIXED: Changed '/all-videos' to '/all' to match Frontend
router.get('/all', authUser, (req, res) => {
    const sql = `SELECT v.*, c.title as course_title 
                 FROM videos v 
                 LEFT JOIN courses c ON v.course_id = c.id`;
    pool.query(sql, (error, data) => {
        res.send(result.createResult(error, data));
    });
});

router.post('/add', authUser, checkAdmin, (req, res) => {
    const { courseId, title, url, description } = req.body;
    const sql = `INSERT INTO videos (course_id, title, url, description) VALUES (?, ?, ?, ?)`;
    pool.query(sql, [courseId, title, url, description], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

router.put('/update/:id', authUser, checkAdmin, (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const sql = `UPDATE videos SET title=?, url=?, description=? WHERE id=?`;
    pool.query(sql, [title, url, description, id], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

router.delete('/delete/:id', authUser, checkAdmin, (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM videos WHERE id=?`;
    pool.query(sql, [id], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

module.exports = router;