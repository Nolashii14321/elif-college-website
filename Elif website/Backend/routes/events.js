// // Backend/routes/events.js

// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();

// // --- GET all events ---
// router.get('/', (req, res) => {
//     const sql = `SELECT * FROM events`;
//     db.all(sql, [], (err, rows) => {
//         if (err) {
//             res.status(500).json({ "error": err.message });
//             return;
//         }
//         // FullCalendar expects properties like 'start' and 'end', which match our table.
//         // It also uses 'backgroundColor' and 'borderColor'.
//         res.json(rows);
//     });
// });

// // --- POST (add) a new event ---
// router.post('/', (req, res) => {
//     const { title, start, end, backgroundColor, borderColor } = req.body;
//     const sql = `INSERT INTO events (title, start, "end", backgroundColor, borderColor) VALUES (?, ?, ?, ?, ?)`;
//     const params = [title, start, end || null, backgroundColor, borderColor];
//     db.run(sql, params, function(err) {
//         if (err) {
//             res.status(400).json({ "error": err.message });
//             return;
//         }
//         res.status(201).json({ "id": this.lastID });
//     });
// });

// // --- PUT (update) an event ---
// // This is for when you drag and drop an event to a new date.
// router.put('/:id', (req, res) => {
//     const { title, start, end, backgroundColor, borderColor } = req.body;
//     const sql = `UPDATE events SET
//                     title = ?,
//                     start = ?,
//                     "end" = ?,
//                     backgroundColor = ?,
//                     borderColor = ?
//                  WHERE id = ?`;
//     const params = [title, start, end || null, backgroundColor, borderColor, req.params.id];
//     db.run(sql, params, function(err) {
//         if (err) {
//             res.status(400).json({ "error": err.message });
//             return;
//         }
//         res.json({ "message": "success", "changes": this.changes });
//     });
// });

// // --- DELETE an event ---
// router.delete('/:id', (req, res) => {
//     const sql = `DELETE FROM events WHERE id = ?`;
//     db.run(sql, [req.params.id], function(err) {
//         if (err) {
//             res.status(400).json({ "error": err.message });
//             return;
//         }
//         res.json({ "message": "deleted", "changes": this.changes });
//     });
// });

// module.exports = router;


// Backend/routes/events.js (MySQL Version)

const express = require('express');
const db = require('../database.js'); // Your new MySQL database connection
const router = express.Router();

// --- GET all events ---
router.get('/', (req, res) => {
    // Note: `end` is a reserved keyword in MySQL, so it must be enclosed in backticks.
    const sql = "SELECT `id`, `title`, `start`, `end`, `backgroundColor`, `borderColor` FROM events";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        res.json(results);
    });
});

// --- POST (add) a new event ---
router.post('/', (req, res) => {
    const { title, start, end, backgroundColor, borderColor } = req.body;
    // Use backticks for the `end` column
    const sql = "INSERT INTO events (`title`, `start`, `end`, `backgroundColor`, `borderColor`) VALUES (?, ?, ?, ?, ?)";
    const params = [title, start, end || null, backgroundColor, borderColor];

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.status(201).json({ "id": results.insertId });
    });
});

// --- PUT (update) an event ---
// This is for when you drag and drop an event or edit it.
router.put('/:id', (req, res) => {
    const { title, start, end, backgroundColor, borderColor } = req.body;
    // Use backticks for the `end` column
    const sql = `UPDATE events SET
                    title = ?,
                    start = ?,
                    \`end\` = ?,
                    backgroundColor = ?,
                    borderColor = ?
                 WHERE id = ?`;
    const params = [title, start, end || null, backgroundColor, borderColor, req.params.id];

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.json({ "message": "success", "changes": results.affectedRows });
    });
});

// --- DELETE an event ---
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM events WHERE id = ?`;

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ "message": "Event not found" });
        }
        res.json({ "message": "deleted", "changes": results.affectedRows });
    });
});

module.exports = router;