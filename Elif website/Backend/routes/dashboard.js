// Backend/routes/dashboard.js (MySQL Version)

const express = require('express');
const db = require('../database.js'); // Your new MySQL database connection
const router = express.Router();

// Helper function to make db.query work with async/await
// We only need to define this once.
const queryAsync = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


router.get('/summary', async (req, res) => {
    try {
        // Define all the SQL queries we need to run.
        // Note the change from date('now') to CURDATE() for MySQL.
        const studentCountSql = "SELECT COUNT(id) AS count FROM students";
        const teacherCountSql = "SELECT COUNT(id) AS count FROM users WHERE role = 'Teacher'";
        const eventCountSql = "SELECT COUNT(id) AS count FROM events WHERE start >= CURDATE()";
        const overdueFeesSql = "SELECT SUM(amount) AS total FROM fees WHERE status = 'Overdue'";
        const recentStudentsSql = "SELECT * FROM students ORDER BY id DESC";

        // Run all queries in parallel for maximum efficiency
        const [
            studentCountResult,
            teacherCountResult,
            eventCountResult,
            overdueFeesResult,
            recentStudents
        ] = await Promise.all([
            queryAsync(studentCountSql),
            queryAsync(teacherCountSql),
            queryAsync(eventCountSql),
            queryAsync(overdueFeesSql),
            queryAsync(recentStudentsSql)
        ]);

        // Extract the data from the results. MySQL returns an array even for COUNT/SUM.
        const totalStudents = studentCountResult[0]?.count || 0;
        const totalTeachers = teacherCountResult[0]?.count || 0;
        const upcomingEvents = eventCountResult[0]?.count || 0;
        const overdueFees = overdueFeesResult[0]?.total || 0;

        res.json({
            totalStudents: totalStudents,
            totalTeachers: totalTeachers,
            upcomingEvents: upcomingEvents,
            overdueFees: overdueFees,
            recentStudents: recentStudents || [] // recentStudents is already an array
        });

    } catch (error) {
        console.error("Dashboard summary error:", error.message);
        res.status(500).json({ error: "Failed to load dashboard data" });
    }
});

module.exports = router;


// // Backend/routes/dashboard.js
// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();

// router.get('/summary', async (req, res) => {
//     try {
//         // Promisify the db functions for modern async/await syntax
//         db.get_async = (sql, params) => new Promise((resolve, reject) => {
//             db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
//         });
//         db.all_async = (sql, params) => new Promise((resolve, reject) => {
//             db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
//         });

//         const queries = [
//             db.get_async("SELECT COUNT(id) AS count FROM students"),
//             db.get_async("SELECT COUNT(id) AS count FROM users WHERE role = 'Teacher'"),
//             db.get_async("SELECT COUNT(id) AS count FROM events WHERE start >= date('now')"),
//             db.get_async("SELECT SUM(amount) AS total FROM fees WHERE status = 'Overdue'"),
//             // --- THIS IS THE UPDATED LINE ---
//             // It now orders by the student ID in descending order to show the newest students first.
//             db.all_async("SELECT * FROM students ORDER BY id DESC")
//         ];

//         const [studentCount, teacherCount, eventCount, overdueFees, recentStudents] = await Promise.all(queries);

//         res.json({
//             totalStudents: studentCount.count || 0,
//             totalTeachers: teacherCount.count || 0,
//             upcomingEvents: eventCount.count || 0,
//             overdueFees: overdueFees.total || 0,
//             recentStudents: recentStudents || []
//         });
//     } catch (error) {
//         console.error("Dashboard summary error:", error.message);
//         res.status(500).json({ error: "Failed to load dashboard data" });
//     }
// });
// module.exports = router;