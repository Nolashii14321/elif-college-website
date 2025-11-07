// // backend/routes/libraryPortal.js
// const express = require('express');
// const router = express.Router();
// const db = require('../database');

// // POST /api/library-portal/login
// // Securely authenticates a student for library access.
// router.post('/login', (req, res) => {
//     const { studentId, birthDate } = req.body;

//     if (!studentId || !birthDate) {
//         return res.status(400).json({ error: 'Student ID and Birth Date are required.' });
//     }
    
//     // This query just checks if a student with these credentials exists.
//     // We only need their name for the welcome message.
//     const studentQuery = `SELECT id, name FROM students WHERE id = ? AND birthDate = ?`;
    
//     db.get(studentQuery, [studentId, birthDate], (err, student) => {
//         if (err) {
//             console.error("Library login error:", err.message);
//             return res.status(500).json({ error: "A server error occurred." });
//         }
//         if (!student) {
//             return res.status(401).json({ error: 'Invalid Student ID or Password.' });
//         }
        
//         // If credentials are correct, send back a success message with the student's name.
//         res.json({
//             message: "Login successful",
//             studentName: student.name
//         });
//     });
// });

// module.exports = router;
// backend/routes/libraryPortal.js (MySQL Version)

const express = require('express');
const router = express.Router();
const db = require('../database'); // Your new MySQL database connection

// POST /api/library-portal/login
// Securely authenticates a student for library access.
router.post('/login', (req, res) => {
    const { studentId, birthDate } = req.body;

    if (!studentId || !birthDate) {
        return res.status(400).json({ error: 'Student ID and Birth Date are required.' });
    }
    
    // This query just checks if a student with these credentials exists.
    // We only need their name for the welcome message.
    const sql = `SELECT id, name FROM students WHERE id = ? AND birthDate = ?`;
    
    db.query(sql, [studentId, birthDate], (err, results) => {
        if (err) {
            console.error("Library login error:", err.message);
            return res.status(500).json({ error: "A server error occurred." });
        }
        
        // In MySQL, results is an array. If it's empty, no student was found.
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid Student ID or Password.' });
        }

        // Get the first (and only) student from the results array
        const student = results[0];
        
        // If credentials are correct, send back a success message with the student's name.
        res.json({
            message: "Login successful",
            studentName: student.name
        });
    });
});

module.exports = router;



