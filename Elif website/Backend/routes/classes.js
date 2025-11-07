// // Backend/routes/classes.js (MySQL Version)

// const express = require('express');
// const db = require('../database.js'); // Your new MySQL database connection
// const router = express.Router();

// // GET all classes
// router.get('/', (req, res) => {
//     // This SQL query joins with the 'users' table to get the teacher's name.
//     const sql = `
//         SELECT
//             c.id,
//             c.name,
//             c.room,
//             c.students,
//             c.capacity,
//             c.color,
//             c.teacherId,
//             u.name AS teacherName
//         FROM classes c
//         LEFT JOIN users u ON c.teacherId = u.id
//     `;
    
//     db.query(sql, (err, results) => {
//         if (err) {
//             console.error("Class GET Error:", err.message);
//             return res.status(500).json({ "error": err.message });
//         }
//         res.json(results);
//     });
// });

// // POST (add) a new class
// router.post('/', (req, res) => {
//     const { name, teacherId, room, students, capacity, color } = req.body;
//     const sql = `INSERT INTO classes (name, teacherId, room, students, capacity, color) VALUES (?, ?, ?, ?, ?, ?)`;
    
//     db.query(sql, [name, teacherId, room, students, capacity, color], (err, results) => {
//         if (err) return res.status(400).json({ "error": err.message });
//         // Use results.insertId for MySQL to get the ID of the new class
//         res.status(201).json({ "id": results.insertId });
//     });
// });

// // PUT (update) a class
// router.put('/:id', (req, res) => {
//     const { name, teacherId, room, students, capacity, color } = req.body;
//     const sql = `UPDATE classes SET name = ?, teacherId = ?, room = ?, students = ?, capacity = ?, color = ? WHERE id = ?`;
    
//     db.query(sql, [name, teacherId, room, students, capacity, color, req.params.id], (err, results) => {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "success" });
//     });
// });

// // DELETE a class
// router.delete('/:id', (req, res) => {
//     const sql = `DELETE FROM classes WHERE id = ?`;
    
//     db.query(sql, [req.params.id], (err, results) => {
//         if (err) return res.status(400).json({ "error": err.message });
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ "message": "Class not found" });
//         }
//         res.json({ "message": "deleted" });
//     });
// });

// module.exports = router;


// backend/routes/classes.js (MySQL Version with Meeting Link)

const express = require('express');
const db = require('../database.js');// Your new MySQL database connection
const router = express.Router();

// GET all classes
router.get('/', (req, res) => {
    // This SQL query joins with the 'users' table to get the teacher's name
    // and now also selects the new meeting_link column.
    const sql = `
    SELECT
        c.id,
        c.name,
        c.room,
        c.capacity,
        c.color,
        c.teacherId,
        c.meeting_link,
        u.name AS teacherName,
        COUNT(s.id) AS students
    FROM
        classes c
    LEFT JOIN
        users u ON c.teacherId = u.id
    LEFT JOIN
        students s ON c.id = s.classId
    GROUP BY c.id, c.name, c.room, c.capacity, c.color, c.teacherId, c.meeting_link, u.name
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Class GET Error:", err.message);
            return res.status(500).json({ "error": err.message });
        }
        res.json(results);
    });
});

// POST (add) a new class
router.post('/', (req, res) => {
    // Removed `students` from deconstruction, as it's now calculated dynamically.
    const { name, teacherId, room, capacity, color, meeting_link } = req.body;
    
    // Removed `students` from the INSERT statement.
    const sql = `INSERT INTO classes (name, teacherId, room, capacity, color, meeting_link) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [name, teacherId, room, capacity, color, meeting_link || null], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.status(201).json({ "id": results.insertId });
    });
});

// PUT (update) a class
router.put('/:id', (req, res) => {
    // Removed `students` from deconstruction.
    const { name, teacherId, room, capacity, color, meeting_link } = req.body;
    
    // Removed `students` from the UPDATE statement.
    const sql = `UPDATE classes SET name = ?, teacherId = ?, room = ?, capacity = ?, color = ?, meeting_link = ? WHERE id = ?`;
    
    db.query(sql, [name, teacherId, room, capacity, color, meeting_link || null, req.params.id], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "success" });
    });
});

// DELETE a class (Unchanged)
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM classes WHERE id = ?`;
    
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ "message": "Class not found" });
        }
        res.json({ "message": "deleted" });
    });
});

module.exports = router;