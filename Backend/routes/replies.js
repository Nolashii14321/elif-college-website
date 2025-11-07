// // backend/routes/replies.js
// const express = require('express');
// const router = express.Router();
// const imaps = require('imap-simple');
// const { simpleParser } = require('mailparser');

// // This is the configuration to connect to your Gmail inbox.
// // It uses the same .env variables as your Nodemailer setup.
// const config = {
//     imap: {
//         user: process.env.EMAIL_USER,
//         password: process.env.EMAIL_PASS,
//         host: 'imap.gmail.com',
//         port: 993,
//         tls: true,
//         authTimeout: 10000,
//         tlsOptions: {
//             rejectUnauthorized: false
//         }
//     }
// };

// // GET /api/replies
// // This endpoint will fetch unread emails from the inbox.
// router.get('/', async (req, res) => {
//     try {
//         const connection = await imaps.connect(config);
//         await connection.openBox('INBOX');

//         // Search for all unread emails
//         const searchCriteria = ['UNSEEN'];
//         const fetchOptions = {
//             bodies: [''], // Fetch the entire raw email
//             markSeen: true // Mark emails as read after fetching
//         };

//         const messages = await connection.search(searchCriteria, fetchOptions);
//         const replies = [];

//         for (const item of messages) {
//             const all = item.parts.find(part => part.which === '');
//             const rawEmail = all.body;
//             const parsedEmail = await simpleParser(rawEmail);

//             replies.push({
//                 id: parsedEmail.messageId,
//                 from: parsedEmail.from.text,
//                 subject: parsedEmail.subject,
//                 date: parsedEmail.date,
//                 body: parsedEmail.text, // We'll use the plain text body
//             });
//         }

//         connection.end();
//         // Send the newest replies first
//         res.json(replies.reverse());

//     } catch (error) {
//         console.error('Error fetching replies from Gmail:', error);
//         res.status(500).json({ error: 'Failed to retrieve email replies. Please check server logs.' });
//     }
// });

// module.exports = router;

// backend/routes/replies.js (No changes needed for MySQL migration)

const express = require('express');
const router = express.Router();
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

// This configuration connects to your Gmail inbox.
// It uses the same .env variables as your Nodemailer setup.
const config = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 10000, // 10-second timeout
        tlsOptions: {
            rejectUnauthorized: false
        }
    }
};

// GET /api/replies
// This endpoint fetches unread emails from the inbox.
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        // Search criteria for all unread emails
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: [''], // Fetch the entire raw email message
            markSeen: true // Mark emails as read after fetching them
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        const replies = [];

        for (const item of messages) {
            const all = item.parts.find(part => part.which === '');
            const rawEmail = all.body;
            const parsedEmail = await simpleParser(rawEmail);

            replies.push({
                id: parsedEmail.messageId,
                from: parsedEmail.from.text,
                subject: parsedEmail.subject,
                date: parsedEmail.date,
                body: parsedEmail.text, // Use the plain text version of the email body
            });
        }

        // Close the connection
        connection.end();
        
        // Send the newest replies first
        res.json(replies.reverse());

    } catch (error) {
        console.error('Error fetching replies from Gmail:', error);
        // Ensure connection is closed even if an error occurs
        if (connection) {
            connection.end();
        }
        res.status(500).json({ error: 'Failed to retrieve email replies. Please check server logs.' });
    }
});

module.exports = router;