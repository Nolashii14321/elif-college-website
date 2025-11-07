

// // Backend/routes/results.js

// const express = require('express');
// const db = require('../database.js'); // Make sure this path is correct
// const router = express.Router();

// /**
//  * CORRECTED: Get all students for a class and their results for a specific exam.
//  * This is the primary endpoint for the new Results Management page.
//  */
// router.get('/class/:classId/exam/:examId', (req, res) => {
//     const { classId, examId } = req.params;
    
//     // This SQL query is for SQLite. It gets all students from a specific class.
//     // It then uses a LEFT JOIN to attach their results ONLY if they exist for the specific exam.
//     const query = `
//         SELECT 
//             s.id as student_id, 
//             s.name, 
//             r.subjects, 
//             r.gpa, 
//             r.remarks
//         FROM students s
//         LEFT JOIN results r ON s.id = r.student_id AND r.exam_id = ?
//         WHERE s.classId = ? -- Corrected to match your students table schema
//         ORDER BY s.name;
//     `;

//     // Use db.all() for SQLite
//     db.all(query, [examId, classId], (err, rows) => {
//         if (err) {
//             console.error("Error fetching results by class/exam:", err.message);
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(rows);
//     });
// });


// /**
//  * CORRECTED: Save (Insert or Update) a result for a specific student and exam.
//  * This is an "upsert" operation for SQLite.
//  */
// router.post('/', (req, res) => {
//     const { student_id, exam_id, subjects, gpa, remarks } = req.body;

//     if (!student_id || !exam_id) {
//         return res.status(400).json({ error: "student_id and exam_id are required." });
//     }

//     // This query for SQLite will INSERT a new row.
//     // If a row with the same (student_id, exam_id) already exists, it will UPDATE that row instead.
//     // This requires the UNIQUE index on (student_id, exam_id) in your database.
//     const query = `
//         INSERT INTO results (student_id, exam_id, subjects, gpa, remarks)
//         VALUES (?, ?, ?, ?, ?)
//         ON CONFLICT(student_id, exam_id) DO UPDATE SET
//             subjects = excluded.subjects,
//             gpa = excluded.gpa,
//             remarks = excluded.remarks;
//     `;

//     // Use db.run() for SQLite
//     db.run(query, [student_id, exam_id, subjects, gpa, remarks], function(err) {
//         if (err) {
//             console.error("Error saving results:", err.message);
//             return res.status(500).json({ error: err.message });
//         }
//         res.status(201).json({ message: 'Results saved successfully.' });
//     });
// });


// module.exports = router;


// Backend/routes/results.js (MySQL Version)

const express = require('express');
const db = require('../database.js'); // Your new MySQL database connection
const router = express.Router();

/**
 * Get all students for a class and their results for a specific exam.
 * This is the primary endpoint for the new Results Management page.
 */
router.get('/class/:classId/exam/:examId', (req, res) => {
    const { classId, examId } = req.params;
    
    // This SQL query gets all students from a specific class.
    // It then uses a LEFT JOIN to attach their results ONLY if they exist for the specific exam.
    const sql = `
        SELECT 
            s.id as student_id, 
            s.name, 
            r.subjects, 
            r.gpa, 
            r.remarks
        FROM students s
        LEFT JOIN results r ON s.id = r.student_id AND r.exam_id = ?
        WHERE s.classId = ?
        ORDER BY s.name;
    `;

    db.query(sql, [examId, classId], (err, results) => {
        if (err) {
            console.error("Error fetching results by class/exam:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


/**
 * Save (Insert or Update) a result for a specific student and exam.
 * This is an "upsert" operation for MySQL.
 */
router.post('/', (req, res) => {
    const { student_id, exam_id, subjects, gpa, remarks } = req.body;

    if (!student_id || !exam_id) {
        return res.status(400).json({ error: "student_id and exam_id are required." });
    }

    // This query for MySQL will INSERT a new row.
    // If a row with the same unique key (student_id, exam_id) already exists, it will UPDATE that row instead.
    const sql = `
        INSERT INTO results (student_id, exam_id, subjects, gpa, remarks)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            subjects = VALUES(subjects),
            gpa = VALUES(gpa),
            remarks = VALUES(remarks);
    `;

    db.query(sql, [student_id, exam_id, subjects, gpa, remarks], (err, results) => {
        if (err) {
            console.error("Error saving results:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Results saved successfully.' });
    });
});


module.exports = router;
