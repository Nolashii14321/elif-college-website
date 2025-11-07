


// // Backend/routes/news.js

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const db = require('../database.js');
// const router = express.Router();

// // Define the upload directory and ensure it exists
// const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'news');
// fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
//     filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
// });
// const upload = multer({ storage: storage });

// router.get('/', (req, res) => {
//     db.all(`SELECT * FROM news ORDER BY id DESC`, [], (err, rows) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(rows);
//     });
// });

// router.get('/:id', (req, res) => {
//     db.get(`SELECT * FROM news WHERE id = ?`, [req.params.id], (err, row) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(row);
//     });
// });

// // POST a new news article with the corrected path logic
// router.post('/', upload.single('imageFile'), (req, res) => {
//     const { title, summary, content } = req.body;

//     // --- THIS IS THE CRITICAL FIX ---
//     // Create a web-friendly relative path to store in the database.
//     const imageUrl = req.file ? `/uploads/news/${req.file.filename}` : null;

//     const publishDate = new Date().toISOString().split('T')[0];
//     const sql = `INSERT INTO news (title, summary, imageUrl, content, publishDate) VALUES (?, ?, ?, ?, ?)`;
//     db.run(sql, [title, summary, imageUrl, content, publishDate], function (err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.status(201).json({ "id": this.lastID });
//     });
// });

// router.delete('/:id', (req, res) => {
//     db.run(`DELETE FROM news WHERE id = ?`, [req.params.id], function (err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "deleted" });
//     });
// });

// module.exports = router;

// Backend/routes/news.js (MySQL Version)

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database.js'); // Your new MySQL database connection
const router = express.Router();

// --- Multer Configuration (Unchanged) ---
const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'news');
fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });


// --- API Routes (Converted to MySQL) ---

// GET all news articles
router.get('/', (req, res) => {
    db.query(`SELECT * FROM news ORDER BY id DESC`, (err, results) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(results);
    });
});

// GET a single news article by ID
router.get('/:id', (req, res) => {
    db.query(`SELECT * FROM news WHERE id = ?`, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ "error": err.message });
        if (results.length === 0) {
            return res.status(404).json({ "error": "News article not found" });
        }
        res.json(results[0]); // Return the first (and only) result
    });
});

// POST a new news article
router.post('/', upload.single('imageFile'), (req, res) => {
    const { title, summary, content } = req.body;

    // Create a web-friendly relative path to store in the database
    const imageUrl = req.file ? `/uploads/news/${req.file.filename}` : null;

    // MySQL can handle the current timestamp automatically with NOW()
    const sql = `INSERT INTO news (title, summary, imageUrl, content, publishDate) VALUES (?, ?, ?, ?, NOW())`;
    
    db.query(sql, [title, summary, imageUrl, content], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.status(201).json({ "id": results.insertId });
    });
});

// DELETE a news article
router.delete('/:id', (req, res) => {
    // Note: A more advanced version would also delete the associated image file from the server
    db.query(`DELETE FROM news WHERE id = ?`, [req.params.id], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ "message": "News article not found" });
        }
        res.json({ "message": "deleted" });
    });
});

module.exports = router;