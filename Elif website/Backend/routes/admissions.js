


// // Backend/routes/admissions.js (MySQL Version)

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const db = require('../database.js'); // Your new MySQL database connection
// const router = express.Router();

// // --- Multer Configuration (Unchanged) ---
// const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'applications');
// fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, UPLOAD_DIRECTORY);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });
// const upload = multer({ storage: storage });


// // --- API Routes (Converted to MySQL) ---

// // GET all applications
// router.get('/', (req, res) => {
//     const sql = `SELECT * FROM applications ORDER BY id DESC`;
//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(results);
//     });
// });

// // POST a new application
// router.post('/', upload.single('applicationLetter'), (req, res) => {
//     const { name, birthDate, gradeToEnroll, previousSchool, parentName, parentEmail, parentPhone } = req.body;

//     // Create a web-friendly relative path to store in the database
//     const applicationLetterPath = req.file ? `/uploads/applications/${req.file.filename}` : null;

//     // MySQL can handle the current timestamp automatically with NOW()
//     const sql = `INSERT INTO applications (name, birthDate, gradeToEnroll, previousSchool, parentName, parentEmail, parentPhone, applicationLetterPath, submissionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
//     const params = [name, birthDate, gradeToEnroll, previousSchool, parentName, parentEmail, parentPhone, applicationLetterPath];

//     db.query(sql, params, (err, results) => {
//         if (err) {
//             console.error("Admission Save Error:", err.message);
//             return res.status(400).json({ "error": "Failed to submit application." });
//         }
//         res.status(201).json({ "message": "Application submitted successfully!" });
//     });
// });

// // PUT route to update status
// router.put('/:id', (req, res) => {
//     const { status } = req.body;
//     const sql = `UPDATE applications SET status = ? WHERE id = ?`;

//     db.query(sql, [status, req.params.id], (err, results) => {
//         if (err) return res.status(400).json({ "error": err.message });
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ "message": "Application not found" });
//         }
//         res.json({ "message": "Status updated successfully." });
//     });
// });

// module.exports = router;



// backend/routes/admissions.js (Code confirmed for your folder structure)

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database.js');
const router = express.Router();

// This path calculation is correct for your structure.
// __dirname = '.../Backend/routes'
// '..' goes to '.../Backend'
// '..' goes to '.../ELIF WEBSITE'
// Final path = '/ELIF WEBSITE/uploads/applications'
const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'applications');

// Ensure the directory exists
fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIRECTORY);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// --- API Routes ---

// GET all applications
router.get('/', (req, res) => {
    const sql = `SELECT * FROM applications ORDER BY submissionDate DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(results);
    });
});

// POST a new application
router.post('/', upload.single('applicationLetter'), (req, res) => {
    const { name, birthDate, gradeToEnroll, previousSchool, parentName, parentEmail, parentPhone } = req.body;
    // This path is correct: "uploads/applications/filename.pdf"
    const applicationLetterPath = req.file ? `uploads/applications/${req.file.filename}` : null;
    const submissionDate = new Date();

    const sql = `INSERT INTO applications (name, birthDate, gradeToEnroll, previousSchool, parentName, parentEmail, parentPhone, applicationLetterPath, submissionDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
    const params = [name, birthDate, gradeToEnroll, previousSchool, parentName, parentEmail, parentPhone, applicationLetterPath, submissionDate];

    db.query(sql, params, function (err, result) {
        if (err) return res.status(400).json({ "error": "Failed to submit application." });
        res.status(201).json({ "message": "Application submitted successfully!" });
    });
});

// PUT route to update status
router.put('/:id', (req, res) => {
    const { status } = req.body;
    const sql = `UPDATE applications SET status = ? WHERE id = ?`;
    db.query(sql, [status, req.params.id], function (err, result) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "Status updated successfully." });
    });
});

module.exports = router;