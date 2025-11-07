// // Backend/routes/news.js

// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();

// // GET all news articles, newest first
// router.get('/', (req, res) => {
//     const sql = `SELECT * FROM news ORDER BY id DESC`;
//     db.all(sql, [], (err, rows) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(rows);
//     });
// });

// // GET a single news article by its ID
// router.get('/:id', (req, res) => {
//     const sql = `SELECT * FROM news WHERE id = ?`;
//     db.get(sql, [req.params.id], (err, row) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         if (!row) return res.status(404).json({ "error": "Article not found" });
//         res.json(row);
//     });
// });

// // POST a new news article
// router.post('/', (req, res) => {
//     const { title, summary, imageUrl, content } = req.body;
//     const publishDate = new Date().toISOString().split('T')[0];
//     const sql = `INSERT INTO news (title, summary, imageUrl, content, publishDate) VALUES (?, ?, ?, ?, ?)`;
//     db.run(sql, [title, summary, imageUrl, content, publishDate], function(err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.status(201).json({ "id": this.lastID });
//     });
// });

// // DELETE a news article
// router.delete('/:id', (req, res) => {
//     const sql = `DELETE FROM news WHERE id = ?`;
//     db.run(sql, [req.params.id], function(err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "deleted" });
//     });
// });

// module.exports = router;


// Backend/routes/news.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database.js');
const router = express.Router();

// Define the upload directory and ensure it exists
const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'news');
fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    db.all(`SELECT * FROM news ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(rows);
    });
});

router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM news WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(row);
    });
});

// POST a new news article with the corrected path logic
router.post('/', upload.single('imageFile'), (req, res) => {
    const { title, summary, content } = req.body;

    // --- THIS IS THE CRITICAL FIX ---
    // Create a web-friendly relative path to store in the database.
    const imageUrl = req.file ? `/uploads/news/${req.file.filename}` : null;

    const publishDate = new Date().toISOString().split('T')[0];
    const sql = `INSERT INTO news (title, summary, imageUrl, content, publishDate) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [title, summary, imageUrl, content, publishDate], function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.status(201).json({ "id": this.lastID });
    });
});

router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM news WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "deleted" });
    });
});

module.exports = router;