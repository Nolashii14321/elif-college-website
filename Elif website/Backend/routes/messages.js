// // Backend/routes/messages.js

// const express = require('express');
// const db = require('../database.js');
// const router = express.Router();

// // GET all messages, grouped by channel
// router.get('/', (req, res) => {
//     const sql = `SELECT * FROM messages ORDER BY id DESC`;
//     db.all(sql, [], (err, rows) => {
//         if (err) return res.status(500).json({ "error": err.message });
//         const groupedMessages = rows.reduce((acc, msg) => {
//             const channel = msg.channelId;
//             if (!acc[channel]) acc[channel] = [];
//             msg.unread = msg.isRead === 0;
//             acc[channel].push(msg);
//             return acc;
//         }, {});
//         res.json(groupedMessages);
//     });
// });

// // POST (send) a new message (UPDATED VERSION)
// router.post('/', (req, res) => {
//     const { channelId, subject, body, sender } = req.body;
//     const messageSender = sender || "Anonymous";
//     const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//     const sql = `INSERT INTO messages (channelId, sender, subject, body, time) VALUES (?, ?, ?, ?, ?)`;
//     const params = [channelId, messageSender, subject, body, time];
//     db.run(sql, params, function(err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.status(201).json({ "message": "Message sent successfully!", "id": this.lastID });
//     });
// });

// // PUT (mark a message as read)
// router.put('/read/:id', (req, res) => {
//     const sql = `UPDATE messages SET isRead = 1 WHERE id = ?`;
//     db.run(sql, [req.params.id], function(err) {
//         if (err) return res.status(400).json({ "error": err.message });
//         res.json({ "message": "success" });
//     });
// });

// module.exports = router;


// Backend/routes/messages.js (MySQL Version)

const express = require('express');
const db = require('../database.js'); // Your new MySQL database connection
const router = express.Router();

// GET all messages, grouped by channel
router.get('/', (req, res) => {
    const sql = `SELECT * FROM messages ORDER BY id DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ "error": err.message });
        
        // The logic to group messages by channel remains the same
        const groupedMessages = results.reduce((acc, msg) => {
            const channel = msg.channelId;
            if (!acc[channel]) {
                acc[channel] = [];
            }
            // MySQL returns 0 or 1 for booleans, this logic is compatible
            msg.unread = msg.isRead === 0;
            acc[channel].push(msg);
            return acc;
        }, {});
        
        res.json(groupedMessages);
    });
});

// POST (send) a new message
router.post('/', (req, res) => {
    const { channelId, subject, body, sender } = req.body;
    const messageSender = sender || "Anonymous";
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    const sql = `INSERT INTO messages (channelId, sender, subject, body, time) VALUES (?, ?, ?, ?, ?)`;
    const params = [channelId, messageSender, subject, body, time];
    
    db.query(sql, params, (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        res.status(201).json({ "message": "Message sent successfully!", "id": results.insertId });
    });
});

// PUT (mark a message as read)
router.put('/read/:id', (req, res) => {
    // In MySQL, it's common to use `true` for boolean updates
    const sql = `UPDATE messages SET isRead = true WHERE id = ?`;
    
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(400).json({ "error": err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ "message": "Message not found" });
        }
        res.json({ "message": "success" });
    });
});

module.exports = router;