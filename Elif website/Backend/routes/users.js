// Backend/routes/users.js (Full Corrected Code with Teacher Verification)

const express = require('express');
const db = require('../database.js');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Needed for hashing passwords
const nodemailer = require('nodemailer'); // Needed for sending emails
const jwt = require('jsonwebtoken'); // Needed for creating secure verification links

// --- Nodemailer Configuration ---
// This uses the email credentials from your .env file to send emails.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// GET all users (Now includes the 'status' column)
router.get('/', (req, res) => {
    // We select all fields EXCEPT the password for security.
    const sql = `SELECT id, name, email, role, status FROM users`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        res.json(results);
    });
});

// POST (add) a new user
// This route is used by your "Add New User" form in the admin panel.
router.post('/', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Hash the password for security before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        
        db.query(sql, [name, email, hashedPassword, role], async (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'A user with this email already exists.' });
                }
                return res.status(400).json({ error: err.message });
            }

            const newUserId = result.insertId;

            // --- TEACHER VERIFICATION LOGIC ---
            // If the new user is a Teacher, send them a verification email.
            if (role === 'Teacher') {
                try {
                    // Create a secure token that contains the user's ID and expires in 7 days
                    const token = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, { expiresIn: '7d' });
                    
                    // This is the link the teacher will click in their email
                    const verificationUrl = `http://localhost:3000/api/users/verify/${token}`;

                    const mailOptions = {
                        from: `"Elif PU College Admin" <${process.env.EMAIL_USER}>`,
                        to: email,
                        subject: 'Action Required: Verify Your Teacher Account',
                        html: `
                            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                                <h2>Welcome to Elif PU College!</h2>
                                <p>Hello ${name},</p>
                                <p>An administrator has created a Teacher account for you on our platform. To activate your account and get started, please click the button below:</p>
                                <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify My Account</a>
                                <p>This verification link is valid for 7 days.</p>
                                <p>If you did not expect this, please ignore this email.</p>
                                <p>Thank you,<br>The Elif PU College Team</p>
                            </div>
                        `
                    };

                    await transporter.sendMail(mailOptions);
                    console.log(`Verification email sent to new teacher: ${email}`);

                } catch (emailError) {
                    console.error("CRITICAL: Failed to send verification email:", emailError);
                    // This part is important. The user is created, but the email failed.
                    // You may want to add a feature to resend the verification email later.
                }
            }

            res.status(201).json({ id: newUserId, message: 'User created successfully.' });
        });
    } catch (hashError) {
        res.status(500).json({ error: 'Error processing request.' });
    }
});

// --- NEW VERIFICATION ROUTE ---
// This route is triggered when a teacher clicks the link in their email.
router.get('/verify/:token', (req, res) => {
    const { token } = req.params;
    try {
        // Check if the token is valid and not expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        // Update the user's status from 'Pending' to 'Active'
        const sql = `UPDATE users SET status = 'Active' WHERE id = ? AND status = 'Pending'`;
        
        db.query(sql, [userId], (err, result) => {
            if (err) {
                return res.status(500).send('<h1>Database Error</h1><p>We could not verify your account at this time. Please contact an administrator.</p>');
            }
            if (result.affectedRows === 0) {
                // This means the link was old, or the user was already active
                return res.status(400).send('<h1>Link Invalid or Expired</h1><p>This verification link may have been used already or has expired. Please contact an administrator if you need assistance.</p>');
            }
            // If successful, redirect to a simple success page
            res.redirect('/HTML/verification-success.html');
        });

    } catch (error) {
        // This catches errors from jwt.verify (e.g., bad token, expired)
        res.status(400).send('<h1>Verification Failed</h1><p>This link is invalid or has expired.</p>');
    }
});

// PUT (update) a user's role or name
router.put('/:id', (req, res) => {
    const { name, email, role } = req.body;
    const sql = `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`;
    
    db.query(sql, [name, email, role, req.params.id], (err, results) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.json({ "message": "success", "changes": results.affectedRows });
    });
});

// DELETE a user
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ "message": "User not found" });
        }
        res.json({ "message": "deleted", "changes": results.affectedRows });
    });
});

module.exports = router;

// // Backend/routes/users.js (With Welcome Emails for Teachers & Parents)

// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');

// // --- Nodemailer Configuration ---
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// // GET all users (with status)
// router.get('/', (req, res) => {
//     const sql = `SELECT id, name, email, role, status FROM users`;
//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         res.json(results);
//     });
// });

// // POST (add) a new user
// router.post('/', async (req, res) => {
//     const { name, email, password, role } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         // --- UPDATED LOGIC ---
//         // Teachers start as 'Pending', while Parents and Admins start as 'Active'.
//         const status = (role === 'Teacher') ? 'Pending' : 'Active';
        
//         const sql = `INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`;
        
//         db.query(sql, [name, email, hashedPassword, role, status], async (err, result) => {
//             if (err) {
//                 if (err.code === 'ER_DUP_ENTRY') {
//                     return res.status(409).json({ error: 'A user with this email already exists.' });
//                 }
//                 return res.status(400).json({ error: err.message });
//             }

//             const newUserId = result.insertId;

//             // --- EMAIL NOTIFICATION LOGIC ---

//             if (role === 'Teacher') {
//                 // Send the verification email to Teachers
//                 try {
//                     const token = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, { expiresIn: '7d' });
//                     const verificationUrl = `http://localhost:3000/api/users/verify/${token}`; // Change for deployment

//                     const mailOptions = {
//                         from: `"Elif PU College Admin" <${process.env.EMAIL_USER}>`,
//                         to: email,
//                         subject: 'Welcome to Elif PU College! Please Verify Your Teacher Account',
//                         html: `
//                             <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//                                 <h2>Welcome to the Team!</h2>
//                                 <p>Hello ${name},</p>
//                                 <p>An administrator has created a Teacher account for you on the Elif PU College online portal. To activate your account, please click the button below:</p>
//                                 <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify My Account</a>
//                                 <p>This link is valid for 7 days.</p>
//                                 <p>Sincerely,<br>The Elif PU College Administration</p>
//                             </div>
//                         `
//                     };
//                     await transporter.sendMail(mailOptions);
//                     console.log(`Verification email sent to new teacher: ${email}`);
//                 } catch (emailError) {
//                     console.error("CRITICAL: Failed to send verification email:", emailError);
//                 }

//             } else if (role === 'Parent') {
//                 // Send a simple welcome/notification email to Parents
//                 try {
//                     const mailOptions = {
//                         from: `"Elif PU College Admin" <${process.env.EMAIL_USER}>`,
//                         to: email,
//                         subject: 'Welcome to the Elif PU College Parent Portal!',
//                         html: `
//                             <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//                                 <h2>Welcome!</h2>
//                                 <p>Hello ${name},</p>
//                                 <p>An administrator has created an account for you on the Elif PU College Parent Portal. You can now log in using this email address and the password provided to you by the administration to view your child's progress, attendance, and more.</p>
//                                 <p>If you have any questions, please contact the school office.</p>
//                                 <p>Sincerely,<br>The Elif PU College Administration</p>
//                             </div>
//                         `
//                     };
//                     await transporter.sendMail(mailOptions);
//                     console.log(`Welcome notification email sent to new parent: ${email}`);
//                 } catch (emailError) {
//                     console.error("CRITICAL: Failed to send parent notification email:", emailError);
//                 }
//             }

//             res.status(201).json({ id: newUserId, message: 'User created successfully.' });
//         });
//     } catch (hashError) {
//         res.status(500).json({ error: 'Error processing request.' });
//     }
// });

// // Verification route for Teachers (Unchanged)
// router.get('/verify/:token', (req, res) => {
//     // ... your existing verification route is correct ...
// });

// // PUT and DELETE routes (Unchanged)
// router.put('/:id', (req, res) => { /* ... */ });
// router.delete('/:id', (req, res) => { /* ... */ });

// module.exports = router;