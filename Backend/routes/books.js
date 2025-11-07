// // Backend/routes/books.js
// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();

// router.get('/', (req, res) => {
//     const sql = `SELECT * FROM books ORDER BY id DESC`;
//     db.all(sql, [], (err, rows) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(rows);
//     });
// });

// router.post('/', (req, res) => {
//     const { title, author, category, cover, digitalLink } = req.body;
//     const sql = `INSERT INTO books (title, author, category, cover, status, digitalLink) VALUES (?, ?, ?, ?, ?, ?)`;
//     const params = [title, author, category, cover, 'Available', digitalLink];
//     db.run(sql, params, function(err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.status(201).json({ "id": this.lastID });
//     });
// });

// router.put('/:id', (req, res) => {
//     const { title, author, category, cover, status, checkedOutTo, digitalLink } = req.body;
//     const sql = `UPDATE books SET title = ?, author = ?, category = ?, cover = ?, status = ?, checkedOutTo = ?, digitalLink = ? WHERE id = ?`;
//     const params = [title, author, category, cover, status, checkedOutTo, digitalLink, req.params.id];
//     db.run(sql, params, function(err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "success", "changes": this.changes });
//     });
// });

// router.delete('/:id', (req, res) => {
//     db.run(`DELETE FROM books WHERE id = ?`, [req.params.id], function(err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "deleted" });
//     });
// });

// module.exports = router;

// // Backend/routes/books.js

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const db = require('../database.js'); // Your SQLite database
// const router = express.Router();

// const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'books');
// fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
//     filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_')); }
// });
// const upload = multer({ storage: storage });

// // GET all books
// router.get('/', (req, res) => {
//     const sql = `SELECT * FROM books ORDER BY id DESC`;
//     db.all(sql, [], (err, rows) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(rows);
//     });
// });

// // POST (add) a new book, with file uploads
// router.post('/', upload.fields([
//     { name: 'coverFile', maxCount: 1 },
//     { name: 'bookFile', maxCount: 1 }
// ]), (req, res) => {
//     const { title, author, category } = req.body;

//     // --- THIS IS THE CRITICAL FIX ---
//     // Create web-friendly relative URLs from the uploaded file's name.
//     const coverPath = req.files['coverFile'] ? `/uploads/books/${req.files['coverFile'][0].filename}` : null;
//     const bookPath = req.files['bookFile'] ? `/uploads/books/${req.files['bookFile'][0].filename}` : null;

//     const sql = `INSERT INTO books (title, author, category, cover, digitalLink, status) VALUES (?, ?, ?, ?, ?, ?)`;
//     const params = [title, author, category, coverPath, bookPath, 'Available'];

//     db.run(sql, params, function (err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.status(201).json({ "id": this.lastID });
//     });
// });

// // PUT (update) a book, with file uploads
// router.put('/:id', upload.fields([
//     { name: 'coverFile', maxCount: 1 },
//     { name: 'bookFile', maxCount: 1 }
// ]), (req, res) => {
//     const { title, author, category, status, checkedOutTo } = req.body;
//     let coverPath = req.body.cover;
//     let bookPath = req.body.digitalLink;

//     // --- THIS IS THE CRITICAL FIX ---
//     // Create web-friendly relative URLs if new files are uploaded.
//     if (req.files['coverFile']) { coverPath = `/uploads/books/${req.files['coverFile'][0].filename}`; }
//     if (req.files['bookFile']) { bookPath = `/uploads/books/${req.files['bookFile'][0].filename}`; }

//     const sql = `UPDATE books SET title = ?, author = ?, category = ?, cover = ?, digitalLink = ?, status = ?, checkedOutTo = ? WHERE id = ?`;
//     const params = [title, author, category, coverPath, bookPath, status, checkedOutTo, req.params.id];

//     db.run(sql, params, function (err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "success" });
//     });
// });

// // DELETE a book
// router.delete('/:id', (req, res) => { /* ... (no change here) ... */ });

// module.exports = router;


// Backend/routes/books.js (MySQL Version)

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database.js'); // Your new MySQL database connection
const router = express.Router();

// --- Multer Configuration for File Uploads (Unchanged) ---
const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'books');
// Ensure the directory exists
fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIRECTORY);
    },
    filename: (req, file, cb) => {
        // Create a unique filename to avoid conflicts
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
    }
});
const upload = multer({ storage: storage });


// --- API Routes (Converted to MySQL) ---

// GET all books
router.get('/', (req, res) => {
    const sql = `SELECT * FROM books ORDER BY id DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(results);
    });
});

// POST (add) a new book, with file uploads
router.post('/', upload.fields([
    { name: 'coverFile', maxCount: 1 },
    { name: 'bookFile', maxCount: 1 }
]), (req, res) => {
    const { title, author, category } = req.body;

    // Create web-friendly relative URLs from the uploaded file's name
    const coverPath = req.files['coverFile'] ? `/uploads/books/${req.files['coverFile'][0].filename}` : null;
    const bookPath = req.files['bookFile'] ? `/uploads/books/${req.files['bookFile'][0].filename}` : null;

    const sql = `INSERT INTO books (title, author, category, cover, digitalLink, status) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [title, author, category, coverPath, bookPath, 'Available'];

    db.query(sql, params, (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        // Use results.insertId for MySQL
        res.status(201).json({ "id": results.insertId });
    });
});

// PUT (update) a book, with file uploads
router.put('/:id', upload.fields([
    { name: 'coverFile', maxCount: 1 },
    { name: 'bookFile', maxCount: 1 }
]), (req, res) => {
    const { title, author, category, status, checkedOutTo } = req.body;
    let coverPath = req.body.cover;
    let bookPath = req.body.digitalLink;

    // Create web-friendly relative URLs if new files are uploaded
    if (req.files['coverFile']) { coverPath = `/uploads/books/${req.files['coverFile'][0].filename}`; }
    if (req.files['bookFile']) { bookPath = `/uploads/books/${req.files['bookFile'][0].filename}`; }

    const sql = `UPDATE books SET title = ?, author = ?, category = ?, cover = ?, digitalLink = ?, status = ?, checkedOutTo = ? WHERE id = ?`;
    const params = [title, author, category, coverPath, bookPath, status, checkedOutTo, req.params.id];

    db.query(sql, params, (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "success" });
    });
});

// DELETE a book
router.delete('/:id', (req, res) => {
    // Note: This only deletes the database record, not the physical files.
    // A more advanced implementation would also delete the cover and book files from the server.
    const sql = `DELETE FROM books WHERE id = ?`;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ "message": "Book not found" });
        }
        res.json({ "message": "deleted" });
    });
});

module.exports = router;