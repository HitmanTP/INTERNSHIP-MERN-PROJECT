const express = require('express');
const pool = require('../db/pool');
const result = require('../utils/result');
const authUser = require('../utils/auth');
const checkAdmin = require('../utils/checkAdmin');
const multer = require('multer'); // IMPORT MULTER
const path = require('path');

const router = express.Router();

// --- MULTER CONFIGURATION (Required for file uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in 'Server/uploads'
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
// --------------------------------------------------------

// 1. Get Active Courses (Public)
router.get('/all-active-courses', (req, res) => {
    const sql = `SELECT * FROM courses WHERE end_date >= CURDATE()`;
    pool.query(sql, (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// 2. Get All Courses (Admin Dashboard)
router.get('/all-courses', authUser, (req, res) => {
    const sql = `SELECT * FROM courses`;
    pool.query(sql, (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// 3. Add Course (Supports File OR URL)
router.post('/add', authUser, checkAdmin, upload.single('image'), (req, res) => {
    const { title, description, price, startDate, endDate, expireDays, imageUrl } = req.body;
    
    let finalImage = '';

    // LOGIC: Priority to File Upload -> Then URL -> Then Empty
    if (req.file) {
        // Assuming server runs on localhost:4000
        finalImage = `http://localhost:4000/${req.file.filename}`;
    } else if (imageUrl) {
        finalImage = imageUrl;
    } else {
        finalImage = ''; 
    }

    const sql = `INSERT INTO courses (title, description, price, start_date, end_date, image_url, expire_days) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
                 
    pool.query(sql, [title, description, price, startDate, endDate, finalImage, expireDays], (error, data) => {
        if (error) {
             console.error("DB Error:", error);
             res.send(result.createResult(error.message, data));
        } else {
             res.send(result.createResult(null, data));
        }
    });
});

// 4. Update Course
router.put('/update/:id', authUser, checkAdmin, (req, res) => {
    const { id } = req.params;
    const { title, description, price, startDate, endDate, expireDays, image } = req.body;
    
    const sql = `UPDATE courses SET title=?, description=?, price=?, start_date=?, end_date=?, expire_days=?, image_url=? 
                 WHERE id=?`;
                 
    pool.query(sql, [title, description, price, startDate, endDate, expireDays, image, id], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

// 5. Delete Course
router.delete('/delete/:id', authUser, checkAdmin, (req, res) => {
    const { id } = req.params;
    
    // Step 1: Delete all Enrollments for this course
    pool.query(`DELETE FROM enrollments WHERE course_id = ?`, [id], (err1) => {
        if (err1) {
            return res.send(result.createResult(err1));
        }

        // Step 2: Delete all Videos for this course
        pool.query(`DELETE FROM videos WHERE course_id = ?`, [id], (err2) => {
            if (err2) {
                return res.send(result.createResult(err2));
            }

            // Step 3: Finally, Delete the Course itself
            const sql = `DELETE FROM courses WHERE id=?`;
            pool.query(sql, [id], (error, data) => {
                res.send(result.createResult(error, data));
            });
        });
    });
});

module.exports = router;