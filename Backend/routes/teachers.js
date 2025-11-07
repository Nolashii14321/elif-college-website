// // Backend/routes/teachers.js (MySQL Version)

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const db = require('../database.js'); // Your new MySQL database connection
// const router = express.Router();

// // --- Multer Configuration (Unchanged) ---
// const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'teachers');
// fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
//     filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
// });
// const upload = multer({ storage: storage });


// // --- API Routes (Converted to MySQL) ---

// // GET all users with the role 'Teacher'
// router.get('/', (req, res) => {
//     const sql = `SELECT id, name, subject, email, image FROM users WHERE role = 'Teacher' ORDER BY id DESC`;
//     db.query(sql, (err, results) => {
//         if (err) {
//             console.error("Error fetching teachers:", err.message);
//             return res.status(500).json({ "error": err.message });
//         }
//         res.json(results);
//     });
// });

// // PUT (update) a teacher's details, with file upload handling
// router.put('/:id', upload.single('imageFile'), (req, res) => {
//     const { name, subject, email } = req.body;
//     let image = req.body.image; // Path to old image from the hidden input

//     if (req.file) {
//         // Create a web-friendly relative URL to store in the database
//         image = `/uploads/teachers/${req.file.filename}`;
//     }

//     const sql = `UPDATE users SET name = ?, subject = ?, email = ?, image = ? WHERE id = ? AND role = 'Teacher'`;
//     db.query(sql, [name, subject, email, image, req.params.id], (err, results) => {
//         if (err) {
//             console.error("Teacher Update Error:", err.message);
//             return res.status(400).json({ "error": err.message });
//         }
//         res.json({ "message": "success" });
//     });
// });

// // GET all data needed for the logged-in teacher's personal dashboard
// router.get('/dashboard-details', (req, res) => {
//     const { email } = req.query;
//     if (!email) return res.status(400).json({ "error": "Teacher email required." });

//     const teacherSql = `SELECT * FROM users WHERE email = ? AND role = 'Teacher'`;
//     db.query(teacherSql, [email], (err, teacherResults) => {
//         if (err) {
//             console.error("Error fetching teacher dashboard details:", err.message);
//             return res.status(500).json({ "error": "Database error fetching teacher details." });
//         }
//         if (teacherResults.length === 0) {
//             return res.status(404).json({ "error": "Teacher account not found." });
//         }
//         const teacher = teacherResults[0];

//         const classesSql = `SELECT * FROM classes WHERE teacherId = ?`;
//         db.query(classesSql, [teacher.id], (err, classes) => {
//             if (err) {
//                 console.error("Error fetching teacher classes:", err.message);
//                 return res.status(500).json({ "error": "Database error fetching classes." });
//             }
//             const totalStudents = classes.reduce((sum, c) => sum + (c.students || 0), 0);
//             res.json({ ...teacher, classes: classes || [], totalStudents });
//         });
//     });
// });

// // GET all students for a specific class ID
// router.get('/classes/:classId/students', (req, res) => {
//     const { classId } = req.params;
//     const sql = `SELECT id, name, grade, gpa FROM students WHERE classId = ? ORDER BY name ASC`;
//     db.query(sql, [classId], (err, students) => {
//         if (err) {
//             console.error("Error fetching students for class:", err.message);
//             return res.status(500).json({ "error": "Error fetching students for this class." });
//         }
//         res.json(students);
//     });
// });

// module.exports = router;




// // Elif Pu Collage/backend/routes/teachers.js (Final and Correct)
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const db = require('../database.js');
// const router = express.Router();

// // --- Multer Configuration ---
// const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'teachers');
// fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
//     filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
// });
// const upload = multer({ storage: storage });

// // GET all users with the role 'Teacher'
// router.get('/', (req, res) => {
//     // This query is now guaranteed to work because the columns exist.
//     const sql = `SELECT id, name, subject, email, image FROM users WHERE role = 'Teacher' ORDER BY name ASC`;
//     db.query(sql, (err, results) => {
//         if (err) {
//             console.error("Error fetching teachers:", err.message);
//             return res.status(500).json({ "error": `Database Error: ${err.message}` });
//         }
//         res.json(results);
//     });
// });

// // PUT (update) a teacher's specific details
// router.put('/:id', upload.single('imageFile'), (req, res) => {
//     const { name, subject, email } = req.body;
//     let image = req.body.image;
//     if (req.file) { image = `/uploads/teachers/${req.file.filename}`; }
//     const sql = `UPDATE users SET name = ?, subject = ?, email = ?, image = ? WHERE id = ? AND role = 'Teacher'`;
//     db.query(sql, [name, subject, email, image, req.params.id], (err, results) => {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "success" });
//     });
// });

// // GET dashboard details for a specific teacher
// router.get('/dashboard-details', (req, res) => {
//     const { email } = req.query;
//     if (!email) return res.status(400).json({ "error": "Teacher email required." });
//     const teacherSql = `SELECT * FROM users WHERE email = ? AND role = 'Teacher'`;
//     db.query(teacherSql, [email], (err, teacherResults) => {
//         if (err || teacherResults.length === 0) return res.status(404).json({ "error": "Teacher account not found." });
//         const teacher = teacherResults[0];
//         const classesSql = `SELECT id, name, room, students, meeting_link FROM classes WHERE teacherId = ?`;
//         db.query(classesSql, [teacher.id], (err, classes) => {
//             if (err) return res.status(500).json({ "error": "Database error fetching classes." });
//             const totalStudents = classes.reduce((sum, c) => sum + (c.students || 0), 0);
//             res.json({ ...teacher, classes: classes || [], totalStudents });
//         });
//     });
// });

// // GET all students for a specific class
// router.get('/classes/:classId/students', (req, res) => {
//     const { classId } = req.params;
//     const sql = `SELECT id, name, grade, gpa FROM students WHERE classId = ? ORDER BY name ASC`;
//     db.query(sql, [classId], (err, students) => {
//         if (err) return res.status(500).json({ "error": "Error fetching students for this class." });
//         res.json(students);
//     });
// });

// module.exports = router;



// Elif Pu Collage/backend/routes/teachers.js (Final and Corrected)

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database.js');
const router = express.Router();

// --- Multer Configuration ---
const UPLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'uploads', 'teachers');
fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIRECTORY); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });


// --- API Routes ---

// GET all users with the role 'Teacher'
router.get('/', (req, res) => {
    const sql = `SELECT id, name, subject, email, image FROM users WHERE role = 'Teacher' ORDER BY name ASC`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching teachers:", err.message);
            return res.status(500).json({ "error": `Database Error: ${err.message}` });
        }
        res.json(results);
    });
});

// PUT (update) a teacher's specific details
router.put('/:id', upload.single('imageFile'), (req, res) => {
    const { name, subject, email } = req.body;
    let image = req.body.image;
    if (req.file) { image = `/uploads/teachers/${req.file.filename}`; }
    const sql = `UPDATE users SET name = ?, subject = ?, email = ?, image = ? WHERE id = ? AND role = 'Teacher'`;
    db.query(sql, [name, subject, email, image, req.params.id], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "success" });
    });
});

// --- THIS IS THE CORRECTED ROUTE ---
// GET all data needed for the logged-in teacher's personal dashboard
router.get('/dashboard-details', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ "error": "Teacher email required." });

    const teacherSql = `SELECT * FROM users WHERE email = ? AND role = 'Teacher'`;
    db.query(teacherSql, [email], (err, teacherResults) => {
        if (err || teacherResults.length === 0) {
            return res.status(404).json({ "error": "Teacher account not found." });
        }
        const teacher = teacherResults[0];

        // This is the upgraded SQL query. It now joins with the students table
        // and performs a live COUNT to get the actual number of students in each class.
        const classesSql = `
            SELECT 
                c.id, c.name, c.room, c.meeting_link,
                COUNT(s.id) AS studentCount 
            FROM classes c
            LEFT JOIN students s ON c.id = s.classId
            WHERE c.teacherId = ?
            GROUP BY c.id, c.name, c.room, c.meeting_link`;

        db.query(classesSql, [teacher.id], (err, classes) => {
            if (err) {
                console.error("Error fetching teacher classes:", err.message);
                return res.status(500).json({ "error": "Database error fetching classes." });
            }
            // Now we calculate the total by summing up the live `studentCount`
            const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
            res.json({ ...teacher, classes: classes || [], totalStudents });
        });
    });
});

// GET all students for a specific class
router.get('/classes/:classId/students', (req, res) => {
    const { classId } = req.params;
    const sql = `SELECT id, name, grade, gpa FROM students WHERE classId = ? ORDER BY name ASC`;
    db.query(sql, [classId], (err, students) => {
        if (err) return res.status(500).json({ "error": "Error fetching students for this class." });
        res.json(students);
    });
});

module.exports = router;