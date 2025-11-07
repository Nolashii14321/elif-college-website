


// // Backend/routes/testimonials.js
// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();

// router.get('/', (req, res) => {
//     db.all(`SELECT * FROM testimonials ORDER BY id DESC`, [], (err, rows) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(rows);
//     });
// });

// router.post('/', (req, res) => {
//     const { quote, author, relation } = req.body;
//     if (!quote || !author) {
//         return res.status(400).json({ "error": "Quote and Author are required." });
//     }
//     const sql = `INSERT INTO testimonials (quote, author, relation) VALUES (?, ?, ?)`;
//     db.run(sql, [quote, author, relation], function (err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.status(201).json({ "id": this.lastID });
//     });
// });

// router.delete('/:id', (req, res) => {
//     db.run(`DELETE FROM testimonials WHERE id = ?`, [req.params.id], function (err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "deleted" });
//     });
// });

// module.exports = router;


// Backend/routes/testimonials.js (MySQL Version)

const express = require('express');
const db = require('../database.js'); // Your new MySQL database connection
const router = express.Router();

// GET all testimonials
router.get('/', (req, res) => {
    db.query(`SELECT * FROM testimonials ORDER BY id DESC`, (err, results) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(results);
    });
});

// POST a new testimonial
router.post('/', (req, res) => {
    const { quote, author, relation } = req.body;
    if (!quote || !author) {
        return res.status(400).json({ "error": "Quote and Author are required." });
    }
    const sql = `INSERT INTO testimonials (quote, author, relation) VALUES (?, ?, ?)`;
    
    db.query(sql, [quote, author, relation], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.status(201).json({ "id": results.insertId });
    });
});

// DELETE a testimonial
router.delete('/:id', (req, res) => {
    db.query(`DELETE FROM testimonials WHERE id = ?`, [req.params.id], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ "message": "Testimonial not found" });
        }
        res.json({ "message": "deleted" });
    });
});

module.exports = router;