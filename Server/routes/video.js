const express = require('express');
const pool = require('../db/pool');
const result = require('../utils/result');
const checkAdmin = require('../utils/checkAdmin');
const router = express.Router();

// Get Videos for a Course (Accessible to Students too)
router.get('/all-videos', (req, res) => {
    const { courseId } = req.query;
    const sql = `SELECT * FROM videos WHERE course_id = ?`;
    pool.query(sql, [courseId], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// ADMIN ONLY: Add Video
router.post('/add', checkAdmin, (req, res) => {
    const { courseId, title, youtubeURL, description } = req.body;
    const sql = `INSERT INTO videos (course_id, title, youtube_url, description) VALUES (?, ?, ?, ?)`;
    pool.query(sql, [courseId, title, youtubeURL, description], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// ADMIN ONLY: Update Video
router.put('/update/:videoId', checkAdmin, (req, res) => {
    const { videoId } = req.params;
    const { courseId, title, youtubeURL, description } = req.body;
    const sql = `UPDATE videos SET course_id=?, title=?, youtube_url=?, description=? WHERE video_id=?`;
    pool.query(sql, [courseId, title, youtubeURL, description, videoId], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// ADMIN ONLY: Delete Video
router.delete('/delete/:videoId', checkAdmin, (req, res) => {
    const { videoId } = req.params;
    const sql = `DELETE FROM videos WHERE video_id=?`;
    pool.query(sql, [videoId], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

module.exports = router;