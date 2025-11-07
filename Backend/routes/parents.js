// // backend/routes/parents.js (MySQL Version)
// const express = require('express');
// const router = express.Router();
// const db = require('../database.js');

// router.get('/dashboard-details', (req, res) => {
//     const { email } = req.query;
//     if (!email) return res.status(400).json({ error: "Parent email is required." });

//     const parentSql = `SELECT id, name FROM users WHERE email = ? AND role = 'Parent'`;
//     db.query(parentSql, [email], (err, parentResults) => {
//         if (err) return res.status(500).json({ error: "Database error finding parent." });
//         if (parentResults.length === 0) return res.status(404).json({ error: "Parent account not found." });

//         const parent = parentResults[0];
//         const studentsSql = `SELECT s.id, s.name, s.grade, s.attendance, c.name AS className FROM students s LEFT JOIN classes c ON s.classId = c.id WHERE s.parentId = ?`;
        
//         db.query(studentsSql, [parent.id], (err, students) => {
//             if (err) return res.status(500).json({ error: "Database error finding children." });
//             res.json({ parentName: parent.name, children: students });
//         });
//     });
// });

// module.exports = router;


// backend/routes/parents.js (MySQL Version - Enhanced for Full Dashboard)
const express = require('express');
const router = express.Router();
const db = require('../database.js');

router.get('/dashboard-details', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Parent email is required." });

    // Step 1: Find the parent user.
    const parentSql = `SELECT id, name FROM users WHERE email = ? AND role = 'Parent'`;
    db.query(parentSql, [email], (err, parentResults) => {
        if (err) return res.status(500).json({ error: "Database error finding parent." });
        if (parentResults.length === 0) return res.status(404).json({ error: "Parent account not found." });
        
        const parent = parentResults[0];

        // Step 2: Find all children linked to this parent.
        const studentsSql = `SELECT s.id, s.name, s.grade, s.attendance, c.name AS className FROM students s LEFT JOIN classes c ON s.classId = c.id WHERE s.parentId = ?`;
        db.query(studentsSql, [parent.id], (err, children) => {
            if (err) return res.status(500).json({ error: "Database error finding children." });
            if (children.length === 0) {
                // If there are no children, send back the parent's name and an empty array.
                return res.json({ parentName: parent.name, children: [] });
            }

            // Step 3: Get all results for ALL of the parent's children in a single query.
            const childrenIds = children.map(c => c.id);
            const resultsSql = `
                SELECT r.student_id, r.subjects, r.gpa, r.remarks, e.name AS exam_name
                FROM results r
                JOIN exams e ON r.exam_id = e.id
                WHERE r.student_id IN (?)
                ORDER BY e.exam_date DESC`;

            db.query(resultsSql, [childrenIds], (err, allResults) => {
                if (err) return res.status(500).json({ error: "Database error finding results." });

                // Step 4: Attach the results to the correct child.
                const childrenWithResults = children.map(child => {
                    return {
                        ...child,
                        // Filter the big list of results to find only those for the current child
                        results: allResults.filter(result => result.student_id === child.id)
                    };
                });
                
                // Step 5: Send the complete data package.
                res.json({ parentName: parent.name, children: childrenWithResults });
            });
        });
    });
});

module.exports = router;