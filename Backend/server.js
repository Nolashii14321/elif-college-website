// // // backend/server.js
// // const express = require('express');
// // const cors = require('cors');
// // const path = require('path');
// // const db = require('./database');
// // const app = express();
// // const PORT = 3000;
// // app.use(cors());
// // app.use(express.json());
// // const projectRoot = path.join(__dirname, '..');
// // app.use(express.static(projectRoot));
// // app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));

// // // API Routes (without the /api/hero route)
// // app.use('/api/students', require('./routes/students.js'));
// // app.use('/api/auth', require('./routes/auth.js'));
// // app.use('/api/teachers', require('./routes/teachers.js'));
// // app.use('/api/users', require('./routes/users.js'));
// // app.use('/api/classes', require('./routes/classes.js'));
// // app.use('/api/fees', require('./routes/fees.js'));
// // app.use('/api/events', require('./routes/events.js'));
// // app.use('/api/books', require('./routes/books.js'));
// // app.use('/api/content', require('./routes/content.js'));
// // app.use('/api/results', require('./routes/results.js'));
// // app.use('/api/messages', require('./routes/messages.js'));
// // app.use('/api/reports', require('./routes/reports.js'));
// // app.use('/api/dashboard', require('./routes/dashboard.js'));
// // app.use('/api/attendance', require('./routes/attendance.js'));
// // app.use('/api/admissions', require('./routes/admissions.js'));
// // app.use('/api/news', require('./routes/news.js'));
// // app.use('/api/testimonials', require('./routes/testimonials.js'));
// // app.use('/api/contact', require('./routes/contact.js'));
// // app.use('/api/gallery', require('./routes/gallery.js'));
// // app.use('/api/parents', require('./routes/parents.js'));

// // // Main Homepage Route
// // app.get('/', (req, res) => { res.redirect('/HTML/index.html'); });

// // // Start Server
// // app.listen(PORT, '0.0.0.0', () => {
// //     console.log(`\nServer is running successfully!`);
// // });



// // backend/server.js

// // ADD THIS LINE: It must be at the very top to load environment variables.
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const db = require('./database');
// const app = express();
// const PORT = 3000;
// app.use(cors());
// app.use(express.json());
// const projectRoot = path.join(__dirname, '..');
// app.use(express.static(projectRoot));
// app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));

// // API Routes (without the /api/hero route)
// app.use('/api/communications', require('./routes/communications.js'));
// app.use('/api/replies', require('./routes/replies.js'));
// app.use('/api/students', require('./routes/students.js'));
// app.use('/api/auth', require('./routes/auth.js'));
// app.use('/api/teachers', require('./routes/teachers.js'));
// app.use('/api/users', require('./routes/users.js'));
// app.use('/api/classes', require('./routes/classes.js'));
// app.use('/api/fees', require('./routes/fees.js'));
// app.use('/api/events', require('./routes/events.js'));
// app.use('/api/books', require('./routes/books.js'));
// app.use('/api/content', require('./routes/content.js'));
// app.use('/api/results', require('./routes/results.js'));
// app.use('/api/messages', require('./routes/messages.js'));
// app.use('/api/reports', require('./routes/reports.js'));
// app.use('/api/dashboard', require('./routes/dashboard.js'));
// app.use('/api/attendance', require('./routes/attendance.js'));
// app.use('/api/admissions', require('./routes/admissions.js'));
// app.use('/api/news', require('./routes/news.js'));
// app.use('/api/testimonials', require('./routes/testimonials.js'));
// app.use('/api/contact', require('./routes/contact.js'));
// app.use('/api/gallery', require('./routes/gallery.js'));
// app.use('/api/parents', require('./routes/parents.js'));

// // ADD THIS LINE: This connects your new communications route to the server.
// app.use('/api/communications', require('./routes/communications.js'));


// // Main Homepage Route
// app.get('/', (req, res) => { res.redirect('/HTML/index.html'); });

// // Start Server
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`\nServer is running successfully!`);
// });


// // backend/server.js (Final Corrected Version)

// // This must be at the very top to load environment variables from the .env file.
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const db = require('./database'); // This initializes your new MySQL database connection
// const app = express();
// const PORT = process.env.PORT || 3000;

// // --- Middleware Setup ---
// app.use(cors());
// app.use(express.json());

// // --- Static File Serving ---
// // Define the project root directory (e.g., 'Elif website')
// const projectRoot = path.join(__dirname, '..');
// // This single line serves all your frontend folders (HTML, css, images, etc.)
// app.use(express.static(projectRoot));
// // This specifically serves the /uploads directory so images and files can be accessed.
// app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));


// // --- API Routes (All 18+ routes are included) ---

// // --- Core Portal & User Routes ---
// app.use('/api/auth', require('./routes/auth.js'));
// app.use('/api/dashboard', require('./routes/dashboard.js'));
// app.use('/api/users', require('./routes/users.js'));
// app.use('/api/students', require('./routes/students.js'));
// app.use('/api/teachers', require('./routes/teachers.js'));
// app.use('/api/parents', require('./routes/parents.js'));
// app.use('/api/student-portal', require('./routes/studentPortal.js'));
// app.use('/api/library-portal', require('./routes/libraryPortal.js'));

// // --- School Management Routes ---
// app.use('/api/classes', require('./routes/classes.js'));
// app.use('/api/fees', require('./routes/fees.js'));
// app.use('/api/attendance', require('./routes/attendance.js'));
// app.use('/api/admissions', require('./routes/admissions.js'));
// app.use('/api/events', require('./routes/events.js'));
// app.use('/api/books', require('./routes/books.js'));
// app.use('/api/reports', require('./routes/reports.js'));

// // --- Website Content Routes ---
// app.use('/api/content', require('./routes/content.js'));
// app.use('/api/news', require('./routes/news.js'));
// app.use('/api/testimonials', require('./routes/testimonials.js'));
// app.use('/api/gallery', require('./routes/gallery.js'));
// app.use('/api/contact', require('./routes/contact.js'));

// // --- Communication and Messaging Routes ---
// app.use('/api/communications', require('./routes/communications.js'));
// app.use('/api/replies', require('./routes/replies.js'));
// app.use('/api/messages', require('./routes/messages.js'));

// // --- Exam and Result Management Routes ---
// app.use('/api/exams', require('./routes/exams.js'));
// app.use('/api/results', require('./routes/results.js'));
// app.use('/api/parents', require('./routes/parents.js'));


// // --- Main Homepage Route ---
// // Redirects the base URL (http://localhost:3000) to your main index page.
// app.get('/', (req, res) => { res.redirect('/HTML/index.html'); });


// // --- Start Server ---
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`\nServer is running successfully on http://localhost:${PORT}`);
// });



// backend/server.js (Full Corrected Code)

// This must be at the very top to load environment variables from the .env file.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database'); // This initializes your new MySQL database connection

// Import security middleware
const { 
    securityHeaders, 
    generalLimiter, 
    authLimiter, 
    uploadLimiter, 
    sanitizeInput 
} = require('./middleware/security');
const { httpLogger, logError } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security Middleware Setup (Order is important!) ---
app.use(securityHeaders); // Security headers first
app.use(generalLimiter); // Rate limiting
app.use(httpLogger); // Request logging
app.use(sanitizeInput); // Input sanitization

// --- Basic Middleware Setup ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Static File Serving ---
// Define the project root directory (which is 'ELIF WEBSITE')
const projectRoot = path.join(__dirname, '..');

// FIX: The specific '/uploads' rule MUST come BEFORE the general rule.
// This line correctly serves files from your top-level 'ELIF WEBSITE/uploads' folder.
app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));

app.use('/templates', express.static(path.join(projectRoot, 'templates')));

// app.use('/templates', express.static(path.join(projectRoot, 'templates')));


// This general rule serves all your other frontend folders (HTML, css, images, etc.)
// from the top-level 'ELIF WEBSITE' folder.
app.use(express.static(projectRoot));


// --- API Routes (All 18+ routes are included) ---

// --- Core Portal & User Routes ---
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/dashboard', require('./routes/dashboard.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/students', require('./routes/students.js'));
app.use('/api/teachers', require('./routes/teachers.js'));
app.use('/api/parents', require('./routes/parents.js'));
app.use('/api/student-portal', require('./routes/studentPortal.js'));
app.use('/api/library-portal', require('./routes/libraryPortal.js'));

// --- School Management Routes ---
app.use('/api/classes', require('./routes/classes.js'));
app.use('/api/fees', require('./routes/fees.js'));
app.use('/api/attendance', require('./routes/attendance.js'));
app.use('/api/admissions', require('./routes/admissions.js'));
app.use('/api/events', require('./routes/events.js'));
// app.use('/api/books', require('./routes/books.js'));
app.use('/api/reports', require('./routes/reports.js'));

// --- Website Content Routes ---
app.use('/api/content', require('./routes/content.js'));
app.use('/api/news', require('./routes/news.js'));
app.use('/api/testimonials', require('./routes/testimonials.js'));
app.use('/api/gallery', require('./routes/gallery.js'));
app.use('/api/contact', require('./routes/contact.js'));

// --- Communication and Messaging Routes ---
app.use('/api/communications', require('./routes/communications.js'));
app.use('/api/replies', require('./routes/replies.js'));
app.use('/api/messages', require('./routes/messages.js'));

// --- Exam and Result Management Routes ---
app.use('/api/exams', require('./routes/exams.js'));
app.use('/api/results', require('./routes/results.js'));
// Note: You have '/api/parents' listed twice. This is harmless but the second one is redundant.
app.use('/api/parents', require('./routes/parents.js'));


// --- Main Homepage Route ---
// Redirects the base URL (http://localhost:3000) to your main index page.
app.get('/', (req, res) => { res.redirect('/HTML/index.html'); });


// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    logError(err, req);
    
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(err.status || 500).json({
        error: isDevelopment ? err.message : 'Internal server error',
        ...(isDevelopment && { stack: err.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// --- Start Server ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server is running successfully on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security middleware enabled`);
    console.log(`📝 Logging enabled`);
});