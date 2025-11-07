// // Backend/index.js (or server.js)

// // 1. Load environment variables from .env file at the very top
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const path = require('path');

// // --- Import your routers ---
// const teachersRouter = require('./routes/teachers');
// const communicationsRouter = require('./routes/communications'); // Make sure this line is present
// // ... other router imports

// const app = express();

// // --- Middleware setup ---
// app.use(cors());
// app.use(express.json());

// // --- Static File Serving ---
// app.use(express.static(path.join(__dirname, '..', 'HTML')));
// app.use('/css', express.static(path.join(__dirname, '..', 'css')));
// app.use('/images', express.static(path.join(__dirname, '..', 'images')));
// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// // --- API Routes ---
// // This is the critical part that fixes the 404 error
// app.use('/api/teachers', teachersRouter);
// app.use('/api/communications', communicationsRouter); // This line registers the email sending endpoint
// // ... other app.use() for your other routers

// // --- Start the server ---
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


