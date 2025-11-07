// // // backend/routes/exams.js
// // const express = require('express');
// // const router = express.Router();
// // const db = require('../database'); // Adjust path if needed

// // // GET all exams (Corrected with db.all)
// // router.get('/', (req, res) => {
// //     const query = `
// //         SELECT exams.id, exams.name, exams.exam_date, exams.academic_year, classes.name AS class_name
// //         FROM exams
// //         JOIN classes ON exams.class_id = classes.id
// //         ORDER BY exams.exam_date DESC`;

// //     // USE db.all() for SQLite to get multiple rows
// //     db.all(query, [], (err, rows) => {
// //         if (err) return res.status(500).json({ error: err.message });
// //         res.json(rows);
// //     });
// // });

// // // GET all exams for a specific class (Corrected with db.all)
// // router.get('/by-class/:classId', (req, res) => {
// //     const { classId } = req.params;
// //     const query = 'SELECT id, name FROM exams WHERE class_id = ? ORDER BY name';

// //     // USE db.all() for SQLite to get multiple rows
// //     db.all(query, [classId], (err, rows) => {
// //         if (err) return res.status(500).json({ error: err.message });
// //         res.json(rows);
// //     });
// // });

// // // POST a new exam (Corrected with db.run)
// // router.post('/', (req, res) => {
// //     const { name, class_id, exam_date, academic_year } = req.body;
// //     const query = 'INSERT INTO exams (name, class_id, exam_date, academic_year) VALUES (?, ?, ?, ?)';

// //     // USE db.run() for SQLite to insert data
// //     db.run(query, [name, class_id, exam_date, academic_year], function(err) {
// //         if (err) return res.status(500).json({ error: err.message });
// //         // 'this.lastID' gives the ID of the newly inserted row in SQLite
// //         res.status(201).json({ id: this.lastID, message: 'Exam created successfully.' });
// //     });
// // });

// // // DELETE an exam (Corrected with db.run)
// // router.delete('/:id', (req, res) => {
// //     const { id } = req.params;
// //     const query = 'DELETE FROM exams WHERE id = ?';

// //     // USE db.run() for SQLite to delete data
// //     db.run(query, [id], function(err) {
// //         if (err) return res.status(500).json({ error: err.message });
// //         // 'this.changes' tells you how many rows were affected
// //         if (this.changes === 0) return res.status(404).json({ message: 'Exam not found.' });
// //         res.json({ message: 'Exam deleted successfully.' });
// //     });
// // });

// // module.exports = router;


// // backend/routes/exams.js (MySQL Version)

// const express = require('express');
// const router = express.Router();
// const db = require('../database'); // Your new MySQL database connection

// // GET all exams
// router.get('/', (req, res) => {
//     const sql = `
//         SELECT exams.id, exams.name, exams.exam_date, exams.academic_year, classes.name AS class_name
//         FROM exams
//         JOIN classes ON exams.class_id = classes.id
//         ORDER BY exams.exam_date DESC`;

//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// });

// // GET all exams for a specific class
// router.get('/by-class/:classId', (req, res) => {
//     const { classId } = req.params;
//     const sql = 'SELECT id, name FROM exams WHERE class_id = ? ORDER BY name';

//     db.query(sql, [classId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// });

// // POST a new exam
// router.post('/', (req, res) => {
//     const { name, class_id, exam_date, academic_year } = req.body;
//     const sql = 'INSERT INTO exams (name, class_id, exam_date, academic_year) VALUES (?, ?, ?, ?)';

//     db.query(sql, [name, class_id, exam_date, academic_year], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         // Use results.insertId for MySQL
//         res.status(201).json({ id: results.insertId, message: 'Exam created successfully.' });
//     });
// });

// // DELETE an exam
// router.delete('/:id', (req, res) => {
//     const { id } = req.params;
//     const sql = 'DELETE FROM exams WHERE id = ?';

//     db.query(sql, [id], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         // Use results.affectedRows for MySQL to check if a row was deleted
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ message: 'Exam not found.' });
//         }
//         res.json({ message: 'Exam deleted successfully.' });
//     });
// });

// module.exports = router;


// backend/routes/exams.js (MySQL Version)

const express = require('express');
const router = express.Router();
const db = require('../database'); // Your new MySQL database connection

// GET all exams
router.get('/', (req, res) => {
    const sql = `
        SELECT exams.id, exams.name, exams.exam_date, exams.academic_year, classes.name AS class_name
        FROM exams
        JOIN classes ON exams.class_id = classes.id
        ORDER BY exams.exam_date DESC`;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET all exams for a specific class
router.get('/by-class/:classId', (req, res) => {
    const { classId } = req.params;
    const sql = 'SELECT id, name FROM exams WHERE class_id = ? ORDER BY name';

    db.query(sql, [classId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST a new exam
router.post('/', (req, res) => {
    const { name, class_id, exam_date, academic_year } = req.body;
    const sql = 'INSERT INTO exams (name, class_id, exam_date, academic_year) VALUES (?, ?, ?, ?)';

    db.query(sql, [name, class_id, exam_date, academic_year], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        // Use results.insertId for MySQL
        res.status(201).json({ id: results.insertId, message: 'Exam created successfully.' });
    });
});

// DELETE an exam
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM exams WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        // Use results.affectedRows for MySQL to check if a row was deleted
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Exam not found.' });
        }
        res.json({ message: 'Exam deleted successfully.' });
    });
});

module.exports = router;