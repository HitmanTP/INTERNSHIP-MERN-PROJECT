const cron = require('node-cron');
const pool = require('../db/pool');

function startVideoCleanupJob() {
    // Schedule task to run every day at Midnight (00:00)
    // Format: 'Minute Hour Day Month DayOfWeek'
    cron.schedule('0 0 * * *', () => {
        console.log('--- [CRON] Checking for expired videos... ---');
        
        // SQL Logic:
        // 1. Join 'videos' with 'courses'.
        // 2. Calculate the difference between NOW() and video.created_at.
        // 3. If difference >= course.expire_days, DELETE the video.
        
        const deleteSql = `
            DELETE v 
            FROM videos v
            INNER JOIN courses c ON v.course_id = c.id
            WHERE c.expire_days IS NOT NULL 
            AND c.expire_days > 0
            AND DATEDIFF(NOW(), v.created_at) >= c.expire_days
        `;

        pool.query(deleteSql, (error, result) => {
            if (error) {
                console.error("[CRON] Error cleaning up videos:", error);
            } else {
                if (result.affectedRows > 0) {
                    console.log(`[CRON] Cleanup Complete: Deleted ${result.affectedRows} expired videos.`);
                } else {
                    console.log("[CRON] No expired videos found today.");
                }
            }
        });
    });
    
    console.log("--- Automatic Video Cleanup Scheduler Initialized ---");
}

module.exports = startVideoCleanupJob;