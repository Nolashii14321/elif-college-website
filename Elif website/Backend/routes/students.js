// // Backend/routes/students.js (Definitive, Fully Corrected Version)

// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();
// const multer = require('multer');
// const xlsx = require('xlsx');

// // Configure multer to handle file uploads in memory
// const upload = multer({ storage: multer.memoryStorage() });

// // --- DICTIONARY of known header variations (all lowercase) ---
// const HEADER_ALIASES = {
//     FullName: ['fullname', 'student name', 'name', 'full name', 'studentname'],
//     Grade: ['grade', 'class level', 'level', 'gradelevel', 'form'],
//     EnrollmentDate: ['enrollmentdate', 'enrollment date', 'join date', 'start date', 'joindate'],
//     BirthDate: ['birthdate', 'birth date', 'dob', 'date of birth'],
//     ParentEmail: ['parentemail', 'parent email', 'email of parent', 'guardian email', 'parentsemail'],
//     ClassName: ['classname', 'class name', 'class', 'assigned class']
// };

// // --- HELPER FUNCTION TO FORMAT DATES ---
// function formatDateForSQL(date) {
//     if (!date || !(date instanceof Date) || isNaN(date)) {
//         return null; // Return null if the date is invalid, not a date object, or NaN
//     }
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// }

// // GET all students (with corrected date formatting)
// router.get('/', (req, res) => {
//     const sql = `
//         SELECT 
//             id, name, grade, attendance, parentId, classId,
//             DATE_FORMAT(enrollmentDate, '%Y-%m-%d') AS enrollmentDate,
//             DATE_FORMAT(birthDate, '%Y-%m-%d') AS birthDate,
//             gpa, remarks
//         FROM students 
//         ORDER BY id DESC`;

//     db.query(sql, (err, results) => {
//         if (err) {
//             console.error("Database error fetching students:", err);
//             return res.status(500).json({ "error": "Failed to fetch students from database." });
//         }
//         res.json(results);
//     });
// });

// // GET students by a specific class ID
// router.get('/by-class/:classId', (req, res) => {
//     const { classId } = req.params;
//     const sql = `SELECT id, name FROM students WHERE classId = ? ORDER BY name`;
//     db.query(sql, [classId], (err, results) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(results);
//     });
// });

// // POST (add) a single new student
// router.post('/', (req, res) => {
//     const { name, grade, enrollmentDate, birthDate, attendance, parentId, classId } = req.body;
//     const sql = `INSERT INTO students (name, grade, enrollmentDate, birthDate, attendance, parentId, classId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
//     const params = [name, grade, enrollmentDate, birthDate, attendance || null, parentId || null, classId || null];
//     db.query(sql, params, (err, result) => {
//         if (err) {
//             console.error("Error inserting new student:", err);
//             return res.status(400).json({ "error": err.message });
//         }
//         res.status(201).json({ "id": result.insertId });
//     });
// });

// // PUT (update) an existing student
// router.put('/:id', (req, res) => {
//     const { name, grade, enrollmentDate, birthDate, attendance, parentId, classId, gpa, remarks } = req.body;
//     const sql = `UPDATE students SET name = ?, grade = ?, enrollmentDate = ?, birthDate = ?, attendance = ?, parentId = ?, classId = ?, gpa = ?, remarks = ? WHERE id = ?`;
//     const params = [name, grade, enrollmentDate, birthDate, attendance, parentId, classId, gpa, remarks, req.params.id];
//     db.query(sql, params, (err, results) => {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "success" });
//     });
// });

// // DELETE a student
// router.delete('/:id', (req, res) => {
//     const sql = `DELETE FROM students WHERE id = ?`;
//     db.query(sql, [req.params.id], (err, results) => {
//         if (err) return res.status(400).json({ "error": err.message });
//         if (results.affectedRows === 0) return res.status(404).json({ "message": "Student not found" });
//         res.json({ "message": "deleted" });
//     });
// });

// // POST (Bulk Upload) students from an Excel file
// router.post('/bulk-upload', upload.single('studentsFile'), (req, res) => {
//     if (!req.file) return res.status(400).json({ error: 'No file was uploaded.' });

//     db.query("SELECT id, email FROM users WHERE role = 'Parent'", (err, parents) => {
//         if (err) return res.status(500).json({ error: "Failed to fetch parents from database." });
//         db.query("SELECT id, name FROM classes", (err, classes) => {
//             if (err) return res.status(500).json({ error: "Failed to fetch classes from database." });

//             const parentMap = new Map(parents.map(p => [String(p.email).toLowerCase(), p.id]));
//             const classMap = new Map(classes.map(c => [String(c.name).toLowerCase(), c.id]));

//             try {
//                 const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
//                 const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//                 const importedData = xlsx.utils.sheet_to_json(worksheet);

//                 if (importedData.length === 0) return res.status(400).json({ error: 'The Excel file is empty.' });

//                 const normalizedStudents = importedData.map(row => {
//                     const normalizedRow = {};
//                     for (const header in row) {
//                         const normalizedHeader = header.toLowerCase().trim();
//                         for (const standardHeader in HEADER_ALIASES) {
//                             if (HEADER_ALIASES[standardHeader].includes(normalizedHeader)) {
//                                 normalizedRow[standardHeader] = row[header];
//                                 break;
//                             }
//                         }
//                     }
//                     return normalizedRow;
//                 });

//                 const validStudentsForDb = [];
//                 const failedRows = [];

//                 for (const [index, student] of normalizedStudents.entries()) {
//                     const enrollmentDate = formatDateForSQL(student.EnrollmentDate);
//                     const birthDate = formatDateForSQL(student.BirthDate);

//                     if (!student.FullName || !student.Grade || !enrollmentDate || !birthDate) {
//                         failedRows.push({ row: index + 2, name: student.FullName || 'N/A', reason: 'Missing required data or invalid date format.' });
//                         continue;
//                     }

//                     const parentEmail = student.ParentEmail ? String(student.ParentEmail).trim().toLowerCase() : null;
//                     const className = student.ClassName ? String(student.ClassName).trim().toLowerCase() : null;
//                     const parentId = parentEmail ? parentMap.get(parentEmail) : null;
//                     const classId = className ? classMap.get(className) : null;

//                     if (parentEmail && !parentId) {
//                         failedRows.push({ row: index + 2, name: student.FullName, reason: `Parent with email '${student.ParentEmail}' not found.` });
//                         continue;
//                     }
//                     if (className && !classId) {
//                         failedRows.push({ row: index + 2, name: student.FullName, reason: `Class with name '${student.ClassName}' not found.` });
//                         continue;
//                     }

//                     validStudentsForDb.push([
//                         student.FullName, student.Grade, enrollmentDate, birthDate, parentId, classId
//                     ]);
//                 }

//                 if (validStudentsForDb.length > 0) {
//                     const sql = 'INSERT INTO students (name, grade, enrollmentDate, birthDate, parentId, classId) VALUES ?';
//                     db.query(sql, [validStudentsForDb], (err, result) => {
//                         if (err) {
//                             console.error("Bulk insert database error:", err);
//                             return res.status(500).json({ error: 'A database error occurred during the bulk import.', details: err.sqlMessage });
//                         }
//                         let message = `${result.affectedRows} students were imported successfully.`;
//                         if (failedRows.length > 0) message += `\n${failedRows.length} students failed to import.`;
//                         res.status(201).json({ message, errors: failedRows });
//                     });
//                 } else {
//                     res.status(400).json({ message: "Import failed. No valid student records found in the uploaded file.", errors: failedRows });
//                 }
//             } catch (parseError) {
//                 console.error("Error parsing Excel file:", parseError);
//                 res.status(500).json({ error: 'Failed to process the Excel file. Ensure it is a valid .xlsx file.' });
//             }
//         });
//     });
// });

// module.exports = router;



// Backend/routes/students.js (Definitive, Fully Corrected Version)

const express = require('express');
const db = require('../database.js');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');

// Configure multer to handle file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// --- DICTIONARY of known header variations (all lowercase) for flexibility ---
const HEADER_ALIASES = {
    FullName: ['fullname', 'student name', 'name', 'full name', 'studentname'],
    Grade: ['grade', 'class level', 'level', 'gradelevel', 'form'],
    EnrollmentDate: ['enrollmentdate', 'enrollment date', 'join date', 'start date', 'joindate'],
    BirthDate: ['birthdate', 'birth date', 'dob', 'date of birth'],
    ParentEmail: ['parentemail', 'parent email', 'email of parent', 'guardian email', 'parentsemail'],
    ClassName: ['classname', 'class name', 'class', 'assigned class']
};

// --- HELPER FUNCTION TO SAFELY FORMAT DATES ---
function formatDateForSQL(date) {
    if (!date || !(date instanceof Date) || isNaN(date)) {
        return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// GET all students (with corrected, reliable date formatting)
router.get('/', (req, res) => {
    const sql = `
        SELECT 
            id, name, grade, attendance, parentId, classId,
            DATE_FORMAT(enrollmentDate, '%Y-%m-%d') AS enrollmentDate,
            DATE_FORMAT(birthDate, '%Y-%m-%d') AS birthDate,
            gpa, remarks
        FROM students 
        ORDER BY id DESC`;
        
    db.query(sql, (err, results) => {
        if (err) {
            console.error("!!! DATABASE ERROR in GET /api/students:", err);
            return res.status(500).json({ error: "Failed to fetch students from database." });
        }
        res.json(results);
    });
});

// GET students by a specific class ID
router.get('/by-class/:classId', (req, res) => {
    const { classId } = req.params;
    const sql = `SELECT id, name FROM students WHERE classId = ? ORDER BY name`;
    db.query(sql, [classId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST (add) a single new student (relies on database AUTO_INCREMENT)
router.post('/', (req, res) => {
    const { name, grade, enrollmentDate, birthDate, attendance, parentId, classId } = req.body;
    const sql = `INSERT INTO students (name, grade, enrollmentDate, birthDate, attendance, parentId, classId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, grade, enrollmentDate, birthDate, attendance || null, parentId || null, classId || null];
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error inserting new student:", err);
            return res.status(400).json({ "error": err.message });
        }
        res.status(201).json({ "id": result.insertId });
    });
});

// PUT (update) an existing student
router.put('/:id', (req, res) => {
    const { name, grade, enrollmentDate, birthDate, attendance, parentId, classId, gpa, remarks } = req.body;
    const sql = `UPDATE students SET name = ?, grade = ?, enrollmentDate = ?, birthDate = ?, attendance = ?, parentId = ?, classId = ?, gpa = ?, remarks = ? WHERE id = ?`;
    const params = [name, grade, enrollmentDate, birthDate, attendance, parentId, classId, gpa, remarks, req.params.id];
    db.query(sql, params, (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "success" });
    });
});

// DELETE a student
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM students WHERE id = ?`;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        if (results.affectedRows === 0) return res.status(404).json({ "message": "Student not found" });
        res.json({ "message": "deleted" });
    });
});

// POST (Bulk Upload) with "No Validation" logic
router.post('/bulk-upload', upload.single('studentsFile'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file was uploaded.' });

    db.query("SELECT id, email FROM users WHERE role = 'Parent'", (err, parents) => {
        if (err) return res.status(500).json({ error: "Failed to fetch parents from database." });
        db.query("SELECT id, name FROM classes", (err, classes) => {
            if (err) return res.status(500).json({ error: "Failed to fetch classes from database." });

            const parentMap = new Map(parents.map(p => [String(p.email).toLowerCase(), p.id]));
            const classMap = new Map(classes.map(c => [String(c.name).toLowerCase(), c.id]));

            try {
                const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const importedData = xlsx.utils.sheet_to_json(worksheet);

                if (importedData.length === 0) return res.status(400).json({ error: 'The Excel file is empty.' });

                const normalizedStudents = importedData.map(row => {
                    const normalizedRow = {};
                    for (const header in row) {
                        const normalizedHeader = header.toLowerCase().trim();
                        for (const standardHeader in HEADER_ALIASES) {
                            if (HEADER_ALIASES[standardHeader].includes(normalizedHeader)) {
                                normalizedRow[standardHeader] = row[header];
                                break;
                            }
                        }
                    }
                    return normalizedRow;
                });

                const allStudentsForDb = normalizedStudents.map(student => {
                    const enrollmentDate = formatDateForSQL(student.EnrollmentDate);
                    const birthDate = formatDateForSQL(student.BirthDate);
                    const parentEmail = student.ParentEmail ? String(student.ParentEmail).trim().toLowerCase() : null;
                    const className = student.ClassName ? String(student.ClassName).trim().toLowerCase() : null;
                    const parentId = parentMap.get(parentEmail) || null;
                    const classId = classMap.get(className) || null;

                    return [
                        student.FullName || null,
                        student.Grade || null,
                        enrollmentDate,
                        birthDate,
                        parentId,
                        classId
                    ];
                });

                if (allStudentsForDb.length > 0) {
                    const sql = 'INSERT INTO students (name, grade, enrollmentDate, birthDate, parentId, classId) VALUES ?';
                    db.query(sql, [allStudentsForDb], (err, result) => {
                        if (err) {
                            console.error("Bulk insert database error:", err);
                            return res.status(500).json({ error: 'A database error occurred during the bulk import.', details: err.sqlMessage });
                        }
                        res.status(201).json({ message: `Successfully processed ${result.affectedRows} students from the file.` });
                    });
                } else {
                    res.status(400).json({ message: "No students found in the file." });
                }
            } catch (parseError) {
                console.error("Error parsing Excel file:", parseError);
                res.status(500).json({ error: 'Failed to process the Excel file. Ensure it is a valid .xlsx file.' });
            }
        });
    });
});

module.exports = router;