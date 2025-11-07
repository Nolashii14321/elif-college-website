// // Backend/routes/content.js
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const db = require('../database.js');
// const router = express.Router();

// const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'content');
// fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
//     filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.fieldname + path.extname(file.originalname)); }
// });
// const upload = multer({ storage: storage });

// router.get('/', (req, res) => {
//     db.all(`SELECT * FROM content`, [], (err, rows) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         const contentObject = rows.reduce((obj, item) => { (obj[item.key] = item.value); return obj; }, {});
//         res.json(contentObject);
//     });
// });

// router.post('/', upload.fields([
//     { name: 'aboutImageFile', maxCount: 1 }
// ]), (req, res) => {
//     const content = { ...req.body };

//     if (req.files['aboutImageFile']) {
//         content.about_mainImage = `/${req.files['aboutImageFile'][0].path.replace(/\\/g, "/")}`;
//     }

//     const sql = `INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)`;
//     db.serialize(() => {
//         db.run("BEGIN TRANSACTION");
//         for (const key in content) {
//             if (!key.endsWith('File')) {
//                 db.run(sql, [key, content[key]]);
//             }
//         }
//         db.run("COMMIT", (err) => {
//             if (err) return res.status(400).json({ "error": err.message });
//             res.status(200).json({ "message": "Content saved successfully" });
//         });
//     });
// });

// module.exports = router;

// Backend/routes/content.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database.js');
const router = express.Router();

const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'content');
fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.fieldname + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    db.all(`SELECT * FROM content`, [], (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        const contentObject = rows.reduce((obj, item) => { (obj[item.key] = item.value); return obj; }, {});
        res.json(contentObject);
    });
});

// --- THIS IS THE UPDATED SECTION ---
// It now tells multer to look for BOTH the hero and about image files.
router.post('/', upload.fields([
    { name: 'heroBgFile', maxCount: 1 },
    { name: 'aboutImageFile', maxCount: 1 }
]), (req, res) => {
    const content = { ...req.body }; // Get all the text fields

    // Check if the 'heroBgFile' was uploaded
    if (req.files && req.files['heroBgFile']) {
        content.heroBg = `/uploads/content/${req.files['heroBgFile'][0].filename}`;
    }

    // Check if the 'aboutImageFile' was uploaded
    if (req.files && req.files['aboutImageFile']) {
        content.about_mainImage = `/uploads/content/${req.files['aboutImageFile'][0].filename}`;
    }

    const sql = `INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)`;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        for (const key in content) {
            if (!key.endsWith('File')) {
                db.run(sql, [key, content[key]]);
            }
        }
        db.run("COMMIT", (err) => {
            if (err) {
                console.error("Content Save Error:", err.message);
                return res.status(400).json({ "error": "Failed to save content" });
            }
            res.status(200).json({ "message": "Content saved successfully" });
        });
    });
});

module.exports = router;