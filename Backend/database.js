




// // backend/database.js

// const sqlite3 = require('sqlite3').verbose();
// const bcrypt = require('bcrypt');

// // The connection string is unchanged.
// const db = new sqlite3.Database('./school.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
//     if (err) {
//         console.error("Error opening database:", err.message);
//     } else {
//         console.log("Database connected successfully.");
//     }
// });

// db.serialize(() => {
//     console.log('Initializing database tables...');

//     // --- EXISTING TABLES (Unchanged) ---
//     const usersTableSql = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT, subject TEXT, image TEXT, resetPasswordToken TEXT, resetPasswordExpires INTEGER)`;
//     const studentsTableSql = `CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, grade TEXT, enrollmentDate TEXT, birthDate TEXT, gpa TEXT, remarks TEXT, attendance INTEGER, parentId INTEGER, classId INTEGER, FOREIGN KEY (parentId) REFERENCES users (id), FOREIGN KEY (classId) REFERENCES classes (id))`;
//     const classesTableSql = `CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY, name TEXT, teacherId INTEGER, room TEXT, students INTEGER, capacity INTEGER, color TEXT, FOREIGN KEY(teacherId) REFERENCES users(id))`;
//     const feesTableSql = `CREATE TABLE IF NOT EXISTS fees (id INTEGER PRIMARY KEY, studentId INTEGER, amount REAL, status TEXT, dueDate TEXT, FOREIGN KEY(studentId) REFERENCES students(id))`;
//     const eventsTableSql = `CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, title TEXT, start TEXT, "end" TEXT, backgroundColor TEXT, borderColor TEXT)`;
//     const booksTableSql = `CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, category TEXT, status TEXT, checkedOutTo TEXT, cover TEXT, digitalLink TEXT)`;
//     const contentTableSql = `CREATE TABLE IF NOT EXISTS content (key TEXT PRIMARY KEY, value TEXT)`;
//     const messagesTableSql = `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, channelId TEXT, sender TEXT, subject TEXT, body TEXT, "time" TEXT, isRead INTEGER DEFAULT 0)`;
//     const attendanceTableSql = `CREATE TABLE IF NOT EXISTS attendance_records (id INTEGER PRIMARY KEY, student_id INTEGER, date TEXT, status TEXT, UNIQUE(student_id, date))`;
//     const applicationsTableSql = `CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY, name TEXT, birthDate TEXT, gradeToEnroll TEXT, previousSchool TEXT, parentName TEXT, parentEmail TEXT, parentPhone TEXT, applicationLetterPath TEXT, status TEXT DEFAULT 'Pending', submissionDate TEXT)`;
//     const newsTableSql = `CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY, title TEXT, summary TEXT, imageUrl TEXT, content TEXT, publishDate TEXT)`;
//     const testimonialsTableSql = `CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY, quote TEXT, author TEXT, relation TEXT)`;
//     const contactMessagesTableSql = `CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, email TEXT, subject TEXT, message TEXT, submissionDate TEXT, isRead INTEGER DEFAULT 0)`;
//     const galleryTableSql = `CREATE TABLE IF NOT EXISTS gallery_items (id INTEGER PRIMARY KEY, title TEXT, description TEXT, type TEXT, mediaUrl TEXT, category TEXT, uploadDate TEXT)`;


//     // --- NEW AND UPDATED TABLES FOR EXAM MANAGEMENT ---

//     // 1. NEW `exams` table
//     const examsTableSql = `
//         CREATE TABLE IF NOT EXISTS exams (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             class_id INTEGER NOT NULL,
//             exam_date TEXT,
//             academic_year TEXT,
//             FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE
//         )`;

//     // 2. UPDATED `results` table
//     // This new structure is essential for the exam system to work.
//     const resultsTableSql = `
//         CREATE TABLE IF NOT EXISTS results (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             student_id INTEGER NOT NULL,
//             exam_id INTEGER NOT NULL,
//             subjects TEXT, -- Storing subjects as a JSON string
//             gpa TEXT,
//             remarks TEXT,
//             FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
//             FOREIGN KEY (exam_id) REFERENCES exams (id) ON DELETE CASCADE,
//             UNIQUE (student_id, exam_id) -- Ensures a student can only have one result per exam
//         )`;


//     // --- Running all CREATE TABLE queries ---
//     db.run(usersTableSql);
//     db.run(studentsTableSql);
//     db.run(classesTableSql);
//     db.run(feesTableSql);
//     db.run(eventsTableSql);
//     db.run(booksTableSql);
//     db.run(contentTableSql);
//     db.run(messagesTableSql);
//     db.run(attendanceTableSql);
//     db.run(applicationsTableSql);
//     db.run(newsTableSql);
//     db.run(testimonialsTableSql);
//     db.run(contactMessagesTableSql);
//     db.run(galleryTableSql);

//     // Running the new/updated table queries
//     db.run(examsTableSql);
//     db.run(resultsTableSql);


//     // --- Default admin user logic (Unchanged) ---
//     const checkAdminSql = `SELECT * FROM users WHERE email = ?`;
//     db.get(checkAdminSql, ['admin'], async (err, row) => {
//         if (err) {
//             console.error("Error checking for admin user:", err.message);
//             return;
//         }
//         if (!row) {
//             try {
//                 const hashedPassword = await bcrypt.hash('password123', 10);
//                 db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, ['Admin User', 'admin', hashedPassword, 'Admin'], (insertErr) => {
//                     if (insertErr) {
//                         console.error("Error inserting default admin:", insertErr.message);
//                     } else {
//                         console.log("Default admin user created.");
//                     }
//                 });
//             } catch (hashErr) {
//                 console.error("Error hashing password for default admin:", hashErr);
//             }
//         }
//     });

//     console.log('Database tables are ready.');
// });

// module.exports = db;
// backend/database.js (Improved Error Handling)
const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: (process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'root').replace(/^['"]|['"]$/g, ''),
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'school_db'
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('\n--- DATABASE CONNECTION FAILED ---');
        if (err.code === 'ECONNREFUSED') {
            console.error('Error: Connection refused. Is the MySQL server running?');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Error: Access denied. Please check the DB_USER and DB_PASSWORD in your .env file.');
        } else {
            console.error('An unknown database error occurred:', err.message);
        }
        console.error('----------------------------------\n');
        process.exit(1); // Exit the application if connection fails
    }

    if (connection) {
        console.log('Successfully connected to MySQL database pool.');
        connection.release();
    }
});

module.exports = db;
