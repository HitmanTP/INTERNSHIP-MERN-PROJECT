const express = require('express');
const cors = require('cors');
const path = require('path'); 

// Routers
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');
const videoRouter = require('./routes/video');
const studentRouter = require('./routes/student');

// 1. IMPORT THE CRON JOB
const startVideoCleanupJob = require('./utils/cronJobs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Images
app.use(express.static('uploads'));

// Routes
app.use('/user', userRouter);
app.use('/course', courseRouter);
app.use('/video', videoRouter);
app.use('/student', studentRouter);

// 2. START THE SCHEDULER
startVideoCleanupJob();

app.listen(4000, '0.0.0.0', () => {
    console.log('Server is running on port 4000');
});