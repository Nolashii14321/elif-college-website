// backend/routes/studentPortal.js (MySQL Version with Meeting Link)
const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /login
router.post('/login', (req, res) => {
    const { studentId, birthDate } = req.body;
    if (!studentId || !birthDate) return res.status(400).json({ error: 'Student ID and Birth Date are required.' });

    // Step 1: Get student info AND their class's meeting link
    const studentQuery = `
        SELECT s.id, s.name, s.grade, s.enrollmentDate, s.classId, c.meeting_link
        FROM students s
        LEFT JOIN classes c ON s.classId = c.id
        WHERE s.id = ? AND s.birthDate = ?`;
    
    db.query(studentQuery, [studentId, birthDate], (err, studentResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (studentResults.length === 0) return res.status(401).json({ error: 'Invalid Student ID or Password.' });
        const student = studentResults[0];

        // Step 2 & 3 (Unchanged): Fetch all exams and the student's results
        const examsQuery = `SELECT id, name AS exam_name, exam_date FROM exams WHERE class_id = ? ORDER BY exam_date DESC`;
        db.query(examsQuery, [student.classId], (err, allExams) => {
            if (err) return res.status(500).json({ error: err.message });
            const resultsQuery = `SELECT exam_id, subjects, gpa, remarks FROM results WHERE student_id = ?`;
            db.query(resultsQuery, [studentId], (err, studentExamResults) => {
                if (err) return res.status(500).json({ error: err.message });
                const finalExamData = allExams.map(exam => {
                    const foundResult = studentExamResults.find(r => r.exam_id === exam.id);
                    return { exam_id: exam.id, exam_name: exam.exam_name, ...(foundResult || {}) };
                });
                res.json({ studentInfo: student, examList: finalExamData });
            });
        });
    });
});

// GET /results-by-id
router.get('/results-by-id', (req, res) => {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ error: "Student ID is required." });

    // Step 1: Get student info AND their class's meeting link
    const studentQuery = `
        SELECT s.id, s.name, s.grade, s.enrollmentDate, s.classId, c.meeting_link
        FROM students s
        LEFT JOIN classes c ON s.classId = c.id
        WHERE s.id = ?`;
    
    db.query(studentQuery, [studentId], (err, studentResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (studentResults.length === 0) return res.status(404).json({ error: "Student not found." });
        const student = studentResults[0];

        // Steps 2, 3, 4, 5 (Unchanged)
        const examsQuery = `SELECT id, name AS exam_name, exam_date FROM exams WHERE class_id = ? ORDER BY exam_date DESC`;
        db.query(examsQuery, [student.classId], (err, allExams) => {
            if (err) return res.status(500).json({ error: err.message });
            const resultsQuery = `SELECT exam_id, subjects, gpa, remarks FROM results WHERE student_id = ?`;
            db.query(resultsQuery, [studentId], (err, studentExamResults) => {
                if (err) return res.status(500).json({ error: err.message });
                const finalExamData = allExams.map(exam => {
                    const foundResult = studentExamResults.find(r => r.exam_id === exam.id);
                    return { exam_id: exam.id, exam_name: exam.exam_name, ...(foundResult || {}) };
                });
                res.json({ studentInfo: student, examList: finalExamData });
            });
        });
    });
});

module.exports = router;


// // backend/routes/studentPortal.js (MySQL Version)

// const express = require('express');
// const router = express.Router();
// const db = require('../database'); // Your new MySQL database connection

// router.post('/login', (req, res) => {
//     const { studentId, birthDate } = req.body;

//     if (!studentId || !birthDate) {
//         return res.status(400).json({ error: 'Student ID and Birth Date are required.' });
//     }
    
//     // Step 1: Authenticate the student and get their classId.
//     const studentQuery = `SELECT id, name, grade, enrollmentDate, classId FROM students WHERE id = ? AND birthDate = ?`;
    
//     db.query(studentQuery, [studentId, birthDate], (err, studentResults) => {
//         if (err) {
//             console.error("Error finding student:", err.message);
//             return res.status(500).json({ error: err.message });
//         }
//         if (studentResults.length === 0) {
//             return res.status(401).json({ error: 'Invalid Student ID or Password.' });
//         }

//         const student = studentResults[0]; // Get the single student object from the array

//         // --- Start Debugging ---
//         console.log('--- STUDENT PORTAL LOGIN ATTEMPT ---');
//         console.log(`Step 1: Authenticated student "${student.name}" (ID: ${student.id}).`);
//         console.log(`Step 2: Found student's Class ID in database: [${student.classId}]`);
//         // --- End Debugging ---

//         if (!student.classId) {
//             console.log("Step 3: Student is not assigned to a class. Sending empty exam list.");
//             console.log('-------------------------------------\n');
//             return res.json({ studentInfo: student, examList: [] });
//         }

//         // Step 2: Use the found classId to get all exams for that class.
//         const examsQuery = `SELECT id, name AS exam_name, exam_date FROM exams WHERE class_id = ? ORDER BY exam_date DESC`;
        
//         db.query(examsQuery, [student.classId], (err, allExams) => {
//             if (err) {
//                 console.error("Error finding exams for class:", err.message);
//                 return res.status(500).json({ error: err.message });
//             }

//             // --- More Debugging ---
//             console.log(`Step 3: Searched for exams with class_id = ${student.classId}. Found ${allExams.length} exams.`);
//             console.log('-------------------------------------\n');

//             // Step 3: Fetch all of this student's individual results from the database.
//             const resultsQuery = `SELECT exam_id, subjects, gpa, remarks FROM results WHERE student_id = ?`;
            
//             db.query(resultsQuery, [studentId], (err, studentResultsData) => {
//                 if (err) return res.status(500).json({ error: err.message });

//                 // Step 4: Combine the lists
//                 const finalExamData = allExams.map(exam => {
//                     const foundResult = studentResultsData.find(r => r.exam_id === exam.id);
//                     return {
//                         exam_id: exam.id,
//                         exam_name: exam.exam_name,
//                         ...(foundResult || {}) 
//                     };
//                 });
                
//                 res.json({
//                     studentInfo: student,
//                     examList: finalExamData
//                 });
//             });
//         });
//     });
// });

// module.exports = router;