

// Backend/routes/gallery.js (MySQL Version)

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database.js'); // Your new MySQL database connection
const router = express.Router();

// --- Multer Configuration (Unchanged) ---
const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'gallery');
fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

// This middleware is no longer needed as Multer handles multipart data.
// const multipartFormDataParser = express.urlencoded({ extended: true });


// --- API Routes (Converted to MySQL) ---

// GET all gallery items
router.get('/', (req, res) => {
    db.query(`SELECT * FROM gallery_items ORDER BY id DESC`, (err, results) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(results);
    });
});

// POST a new gallery item
router.post('/', upload.single('mediaFile'), (req, res) => {
    const { title, description, type, category } = req.body;

    // Check for a video URL or an uploaded file
    let mediaUrl = req.body.mediaUrl || null; // For videos
    if (req.file) {
        // Create a web-friendly relative URL for uploaded images/files
        mediaUrl = `/uploads/gallery/${req.file.filename}`;
    }

    // MySQL can handle the current timestamp with NOW()
    const sql = `INSERT INTO gallery_items (title, description, type, mediaUrl, category, uploadDate) VALUES (?, ?, ?, ?, ?, NOW())`;

    db.query(sql, [title, description, type, mediaUrl, category], (err, results) => {
        if (err) {
            console.error("Gallery Save Error:", err.message);
            return res.status(400).json({ "error": err.message });
        }
        res.status(201).json({ "id": results.insertId });
    });
});

// DELETE a gallery item
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Step 1: Find the file path of the item to be deleted from the database.
    db.query(`SELECT mediaUrl FROM gallery_items WHERE id = ?`, [id], (err, results) => {
        if (err) return res.status(500).json({ "error": "Database error while finding item." });
        if (results.length === 0) return res.status(404).json({ "error": "Gallery item not found." });

        const mediaUrl = results[0].mediaUrl;

        // Step 2: Delete the record from the database.
        db.query(`DELETE FROM gallery_items WHERE id = ?`, [id], (err, deleteResult) => {
            if (err) return res.status(500).json({ "error": "Database error while deleting item." });

            // Step 3: If the database deletion was successful and there was a file path, delete the file.
            if (mediaUrl && mediaUrl.startsWith('/uploads')) {
                const filePath = path.join(__dirname, '..', '..', mediaUrl);
                fs.unlink(filePath, (unlinkErr) => {
                    // We don't send an error back to the client if file deletion fails,
                    // as the primary goal (deleting the DB record) was successful.
                    // But we log it on the server.
                    if (unlinkErr) {
                        console.error("Error deleting gallery file:", filePath, unlinkErr);
                    } else {
                        console.log("Successfully deleted gallery file:", filePath);
                    }
                });
            }

            res.json({ "message": "deleted" });
        });
    });
});

module.exports = router;