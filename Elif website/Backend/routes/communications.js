// Backend/routes/communications.js (Final Version)

const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// --- Nodemailer Configuration ---
// This transporter is configured to use secure environment variables from your .env file.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS      // Your 16-character Google App Password
    }
});

// POST /api/communications/send
// Receives a request from the frontend to send an email.
router.post('/send', async (req, res) => {
    const { recipients, subject, html } = req.body;

    // Basic validation
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Recipient list is missing or empty.' });
    }
    if (!subject) {
        return res.status(400).json({ error: 'Subject is required.' });
    }
    if (!html) {
        return res.status(400).json({ error: 'Email body (html) is required.' });
    }

    const mailOptions = {
        from: `"Elif PU College Admin" <${process.env.EMAIL_USER}>`,
        to: 'undisclosed-recipients@yourdomain.com', // Placeholder, as BCC is used for privacy.
        bcc: recipients, // Using BCC protects the privacy of recipients' emails.
        subject: subject,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Bulk email sent successfully to:', recipients.join(', '));
        res.json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error sending email with Nodemailer:', error);
        
        // Provide a more specific error message for easier debugging.
        const errorMessage = error.code === 'EAUTH'
            ? 'Authentication failed. Please check your EMAIL_USER and EMAIL_PASS in the .env file and ensure you are using a valid Google App Password.'
            : 'An error occurred while trying to send the email.';
            
        res.status(500).json({ error: errorMessage });
    }
});

module.exports = router;


// // Backend/routes/communications.js
// const express = require('express');
// const nodemailer = require('nodemailer');
// const router = express.Router();

// // --- Nodemailer Configuration ---

// // ADDED FOR DEBUGGING: These lines will print the credentials to your backend terminal.
// // This helps us see if the .env file is being loaded correctly.
// console.log('--- Email Sending Attempt ---');
// console.log('Attempting to use User:', process.env.EMAIL_USER);
// console.log('Attempting to use Pass:', process.env.EMAIL_PASS);
// console.log('---------------------------');


// // This transporter is now configured to use secure environment variables.
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // or your email provider
//     auth: {
//         // These will be loaded from your .env file
//         user: process.env.EMAIL_USER, // Your Gmail address
//         pass: process.env.EMAIL_PASS      // Your 16-character Google App Password
//     }
// });

// // POST /api/communications/send
// // Receives a request from the frontend to send an email.
// router.post('/send', async (req, res) => {
//     const { recipients, subject, html } = req.body;

//     // Basic validation
//     if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
//         return res.status(400).json({ error: 'Recipient list is missing or empty.' });
//     }
//     if (!subject) {
//         return res.status(400).json({ error: 'Subject is required.' });
//     }
//     if (!html) {
//         return res.s
//         tatus(400).json({ error: 'Email body (html) is required.' });
//     }

//     const mailOptions = {
//         // UPDATED: The 'from' address now also uses the environment variable for consistency.
//         from: `"Elif PU College Admin" <${process.env.EMAIL_USER}>`,
//         to: 'undisclosed-recipients@yourdomain.com', // Placeholder, as BCC is used.
//         bcc: recipients, // Using BCC protects the privacy of your teachers' emails.
//         subject: subject,
//         html: html
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully to:', recipients);
//         res.json({ message: 'Email sent successfully.' });
//     } catch (error) {
//         console.error('Error sending email with Nodemailer:', error);

//         // Provide a more specific error message for easier debugging.
//         const errorMessage = error.code === 'EAUTH'
//             ? 'Authentication failed. Please check your EMAIL_USER and EMAIL_PASS in the .env file and ensure you are using a valid Google App Password.'
//             : 'An error occurred while trying to send the email.';

//         res.status(500).json({ error: errorMessage });
//     }
// });

// module.exports = router;