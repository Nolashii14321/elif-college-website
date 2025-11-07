// // Backend/routes/testimonials.js

// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();

// // GET all testimonials, newest first
// router.get('/', (req, res) => {
//     const sql = `SELECT * FROM testimonials ORDER BY id DESC`;
//     db.all(sql, [], (err, rows) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(rows);
//     });
// });

// // POST a new testimonial
// router.post('/', (req, res) => {
//     const { quote, author, relation } = req.body;
//     const sql = `INSERT INTO testimonials (quote, author, relation) VALUES (?, ?, ?)`;
//     db.run(sql, [quote, author, relation], function(err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.status(201).json({ "id": this.lastID });
//     });
// });

// // DELETE a testimonial
// router.delete('/:id', (req, res) => {
//     const sql = `DELETE FROM testimonials WHERE id = ?`;
//     db.run(sql, [req.params.id], function(err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "deleted" });
//     });
// });

// module.exports = router;


// Backend/routes/testimonials.js
const express = require('express');
const db = require('../database.js');
const router = express.Router();

router.get('/', (req, res) => {
    db.all(`SELECT * FROM testimonials ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    const { quote, author, relation } = req.body;
    if (!quote || !author) {
        return res.status(400).json({ "error": "Quote and Author are required." });
    }
    const sql = `INSERT INTO testimonials (quote, author, relation) VALUES (?, ?, ?)`;
    db.run(sql, [quote, author, relation], function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.status(201).json({ "id": this.lastID });
    });
});

router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM testimonials WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "deleted" });
    });
});

module.exports = router;