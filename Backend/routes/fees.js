// // Backend/routes/fees.js

// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();

// // --- GET all fee records ---
// // We JOIN with the students table to get the student's name
// router.get('/', (req, res) => {
//     const sql = `
//         SELECT
//             f.id,
//             f.amount,
//             f.status,
//             f.dueDate,
//             s.name AS studentName
//         FROM fees f
//         JOIN students s ON f.studentId = s.id
//     `;
//     db.all(sql, [], (err, rows) => {
//         if (err) {
//             res.status(500).json({ "error": err.message });
//             return;
//         }
//         res.json(rows);
//     });
// });

// // --- POST (add) a new fee record ---
// router.post('/', (req, res) => {
//     const { studentId, amount, dueDate, status } = req.body;
//     const sql = `INSERT INTO fees (studentId, amount, dueDate, status) VALUES (?, ?, ?, ?)`;
//     const params = [studentId, amount, dueDate, status];
//     db.run(sql, params, function(err) {
//         if (err) {
//             res.status(400).json({ "error": err.message });
//             return;
//         }
//         res.status(201).json({ "id": this.lastID });
//     });
// });

// // --- PUT (update) a fee record ---
// router.put('/:id', (req, res) => {
//     const { studentId, amount, dueDate, status } = req.body;
//     const sql = `UPDATE fees SET
//                     studentId = ?,
//                     amount = ?,
//                     dueDate = ?,
//                     status = ?
//                  WHERE id = ?`;
//     const params = [studentId, amount, dueDate, status, req.params.id];
//     db.run(sql, params, function(err) {
//         if (err) {
//             res.status(400).json({ "error": err.message });
//             return;
//         }
//         res.json({ "message": "success", "changes": this.changes });
//     });
// });

// // --- DELETE a fee record ---
// router.delete('/:id', (req, res) => {
//     const sql = `DELETE FROM fees WHERE id = ?`;
//     db.run(sql, [req.params.id], function(err) {
//         if (err) {
//             res.status(400).json({ "error": err.message });
//             return;
//         }
//         res.json({ "message": "deleted", "changes": this.changes });
//     });
// });

// module.exports = router;


// Backend/routes/fees.js (MySQL Version)

const express = require('express');
const db = require('../database.js'); // Your new MySQL database connection
const router = express.Router();

// --- GET all fee records ---
// We JOIN with the students table to get the student's name
router.get('/', (req, res) => {
    const sql = `
        SELECT
            f.id,
            f.amount,
            f.status,
            f.dueDate,
            s.name AS studentName
        FROM fees f
        JOIN students s ON f.studentId = s.id
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        res.json(results);
    });
});

// --- POST (add) a new fee record ---
router.post('/', (req, res) => {
    const { studentId, amount, dueDate, status } = req.body;
    const sql = `INSERT INTO fees (studentId, amount, dueDate, status) VALUES (?, ?, ?, ?)`;
    const params = [studentId, amount, dueDate, status];
    
    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.status(201).json({ "id": results.insertId });
    });
});

// --- PUT (update) a fee record ---
router.put('/:id', (req, res) => {
    const { studentId, amount, dueDate, status } = req.body;
    const sql = `UPDATE fees SET
                    studentId = ?,
                    amount = ?,
                    dueDate = ?,
                    status = ?
                    WHERE id = ?`;
    const params = [studentId, amount, dueDate, status, req.params.id];
    
    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.json({ "message": "success", "changes": results.affectedRows });
    });
});

// --- DELETE a fee record ---
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM fees WHERE id = ?`;
    
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ "message": "Fee record not found" });
        }
        res.json({ "message": "deleted", "changes": results.affectedRows });
    });
});

module.exports = router;
