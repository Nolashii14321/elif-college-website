// Backend/routes/auth.js (MySQL Version with JWT)

const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../database.js'); // Your new MySQL database connection
const { generateToken, authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');
const { commonValidations, validateInput } = require('../middleware/security');
const { logSecurityEvent, logError } = require('../middleware/logger');
const router = express.Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// --- Registration Route ---
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        
        db.query(sql, [name, email, hashedPassword, role], (err, results) => {
            if (err) {
                // MySQL error code for a duplicate entry is 'ER_DUP_ENTRY'
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ "error": "This email is already registered." });
                }
                return res.status(400).json({ "error": err.message });
            }
            res.status(201).json({ "message": "User registered successfully!" });
        });
    } catch (error) {
        res.status(500).json({ "error": "An error occurred during registration." });
    }
});

// --- Login Route ---
// Removed email validation to allow usernames like "admin"
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`;
    
    db.query(sql, [email], async (err, results) => {
        if (err) {
            logError(err, req);
            return res.status(500).json({ "error": "A database error occurred." });
        }
        
        // In MySQL, results is an array. If it's empty, no user was found.
        if (results.length === 0) {
            logSecurityEvent('LOGIN_FAILED_USER_NOT_FOUND', req, { email });
            return res.status(401).json({ "message": "Invalid email or password" });
        }

        const user = results[0]; // Get the first (and only) user from the results array

        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // Generate JWT token
                const token = generateToken(user);
                
                logSecurityEvent('LOGIN_SUCCESS', req, { 
                    userId: user.id, 
                    role: user.role 
                });
                
                return res.json({ 
                    message: "Login successful",
                    token,
                    user: { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email, 
                        role: user.role 
                    } 
                });
            } else {
                logSecurityEvent('LOGIN_FAILED_WRONG_PASSWORD', req, { 
                    email, 
                    userId: user.id 
                });
                return res.status(401).json({ "message": "Invalid email or password" });
            }
        } catch (bcryptError) {
            logError(bcryptError, req);
            return res.status(500).json({ "error": "An error occurred during authentication." });
        }
    });
});

// --- Forgot Password Routes ---
router.post('/forgot', (req, res) => {
    const { email } = req.body;
    db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(200).json({ message: "If an account with that email exists, a link is sent." });
        }
        
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour
        
        db.query(`UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?`, [token, expires, email], (err, updateResults) => {
            if (err) return res.status(500).json({ error: "Error setting token." });
            
            const resetLink = `http://localhost:3000/HTML/reset-password.html?token=${token}`;
            return res.json({ message: "Reset link generated.", resetLink: resetLink });
        });
    });
});

router.get('/reset/:token', (req, res) => {
    db.query(`SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`, [req.params.token, Date.now()], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ error: "Token is invalid or has expired." });
        }
        res.status(200).json({ message: "Token is valid." });
    });
});

router.post('/update-password', async (req, res) => {
    db.query(`SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`, [req.body.token, Date.now()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ error: "Token is invalid or has expired." });
        }
        
        const user = results[0];
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        db.query(`UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?`, [hashedPassword, user.id], (err, updateResults) => {
            if (err) return res.status(500).json({ error: "Error updating password." });
            res.status(200).json({ message: "Password updated successfully!" });
        });
    });
});

module.exports = router;



// // Backend/routes/auth.js

// const express = require('express');
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const db = require('../database.js'); // Your SQLite database connection
// const router = express.Router();

// // --- Registration Route ---
// router.post('/register', async (req, res) => {
//     const { name, email, password, role } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
//         db.run(sql, [name, email, hashedPassword, role], function (err) {
//             if (err) {
//                 if (err.message.includes("UNIQUE constraint failed")) return res.status(409).json({ "error": "This email is already registered." });
//                 return res.status(400).json({ "error": err.message });
//             }
//             res.status(201).json({ "message": "User registered successfully!" });
//         });
//     } catch (error) { res.status(500).json({ "error": "An error occurred during registration." }); }
// });

// // --- Login Route ---
// router.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     const sql = `SELECT * FROM users WHERE email = ?`;
//     db.get(sql, [email], async (err, user) => {
//         if (err) return res.status(500).json({ "error": "A database error occurred." });
//         if (!user) return res.status(401).json({ "message": "Invalid email or password" });
//         try {
//             const match = await bcrypt.compare(password, user.password);
//             if (match) return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
//             else return res.status(401).json({ "message": "Invalid email or password" });
//         } catch (bcryptError) {
//             return res.status(500).json({ "error": "An error occurred during authentication." });
//         }
//     });
// });

// // --- Forgot Password Routes ---
// router.post('/forgot', (req, res) => {
//     const { email } = req.body;
//     db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
//         if (err || !user) return res.status(200).json({ message: "If an account with that email exists, a link is sent." });
//         const token = crypto.randomBytes(20).toString('hex');
//         const expires = Date.now() + 3600000;
//         db.run(`UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?`, [token, expires, email], (err) => {
//             if (err) return res.status(500).json({ error: "Error setting token." });
//             const resetLink = `http://localhost:3000/HTML/reset-password.html?token=${token}`;
//             return res.json({ message: "Reset link generated.", resetLink: resetLink });
//         });
//     });
// });
// router.get('/reset/:token', (req, res) => {
//     db.get(`SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`, [req.params.token, Date.now()], (err, user) => {
//         if (err || !user) return res.status(400).json({ error: "Token is invalid or has expired." });
//         res.status(200).json({ message: "Token is valid." });
//     });
// });
// router.post('/update-password', async (req, res) => {
//     db.get(`SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`, [req.body.token, Date.now()], async (err, user) => {
//         if (err || !user) return res.status(400).json({ error: "Token is invalid or has expired." });
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         db.run(`UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?`, [hashedPassword, user.id], (err) => {
//             if (err) return res.status(500).json({ error: "Error updating password." });
//             res.status(200).json({ message: "Password updated successfully!" });
//         });
//     });
// });

// module.exports = router;
