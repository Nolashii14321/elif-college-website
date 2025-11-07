


// backend/database.js

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./school.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => { /* ... */ });

db.serialize(() => {
    console.log('Initializing database tables...');
    const usersTableSql = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT, subject TEXT, image TEXT, resetPasswordToken TEXT, resetPasswordExpires INTEGER)`;
    const studentsTableSql = `CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, grade TEXT, enrollmentDate TEXT, birthDate TEXT, gpa TEXT, remarks TEXT, attendance INTEGER, parentId INTEGER, classId INTEGER, FOREIGN KEY (parentId) REFERENCES users (id), FOREIGN KEY (classId) REFERENCES classes (id))`;
    const resultsTableSql = `CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY, student_id INTEGER, subject TEXT, score TEXT, FOREIGN KEY (student_id) REFERENCES students(id))`;
    const classesTableSql = `CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY, name TEXT, teacherId INTEGER, room TEXT, students INTEGER, capacity INTEGER, color TEXT, FOREIGN KEY(teacherId) REFERENCES users(id))`;
    const feesTableSql = `CREATE TABLE IF NOT EXISTS fees (id INTEGER PRIMARY KEY, studentId INTEGER, amount REAL, status TEXT, dueDate TEXT, FOREIGN KEY(studentId) REFERENCES students(id))`;
    const eventsTableSql = `CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, title TEXT, start TEXT, "end" TEXT, backgroundColor TEXT, borderColor TEXT)`;
    const booksTableSql = `CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, category TEXT, status TEXT, checkedOutTo TEXT, cover TEXT, digitalLink TEXT)`;
    const contentTableSql = `CREATE TABLE IF NOT EXISTS content (key TEXT PRIMARY KEY, value TEXT)`;
    const messagesTableSql = `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, channelId TEXT, sender TEXT, subject TEXT, body TEXT, "time" TEXT, isRead INTEGER DEFAULT 0)`;
    const attendanceTableSql = `CREATE TABLE IF NOT EXISTS attendance_records (id INTEGER PRIMARY KEY, student_id INTEGER, date TEXT, status TEXT, UNIQUE(student_id, date) ON CONFLICT REPLACE)`;
    const applicationsTableSql = `CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY, name TEXT, birthDate TEXT, gradeToEnroll TEXT, previousSchool TEXT, parentName TEXT, parentEmail TEXT, parentPhone TEXT, applicationLetterPath TEXT, status TEXT DEFAULT 'Pending', submissionDate TEXT)`;
    const newsTableSql = `CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY, title TEXT, summary TEXT, imageUrl TEXT, content TEXT, publishDate TEXT)`;
    const testimonialsTableSql = `CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY, quote TEXT, author TEXT, relation TEXT)`;
    const contactMessagesTableSql = `CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, email TEXT, subject TEXT, message TEXT, submissionDate TEXT, isRead INTEGER DEFAULT 0)`;
    const galleryTableSql = `CREATE TABLE IF NOT EXISTS gallery_items (id INTEGER PRIMARY KEY, title TEXT, description TEXT, type TEXT, mediaUrl TEXT, category TEXT, uploadDate TEXT)`;

    db.run(usersTableSql);
    db.run(studentsTableSql);
    db.run(resultsTableSql);
    db.run(classesTableSql);
    db.run(feesTableSql);
    db.run(eventsTableSql);
    db.run(booksTableSql);
    db.run(contentTableSql);
    db.run(messagesTableSql);
    db.run(attendanceTableSql);
    db.run(applicationsTableSql);
    db.run(newsTableSql);
    db.run(testimonialsTableSql);
    db.run(contactMessagesTableSql);
    db.run(galleryTableSql);
    
    // Default admin user logic
    const checkAdminSql = `SELECT * FROM users WHERE email = ?`;
    db.get(checkAdminSql, ['admin'], async (err, row) => {
        if (!row) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, ['Admin User', 'admin', hashedPassword, 'Admin']);
        }
    });
    console.log('Database tables are ready.');
});
module.exports = db;




// backend/database.js

// const sqlite3 = require('sqlite3').verbose();
// const bcrypt = require('bcrypt');

// const db = new sqlite3.Database('./school.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
//     if (err) return console.error("Database Connection Error:", err.message);
//     console.log('Connected to the SQLite database.');
// });

// db.serialize(() => {
//     console.log('Initializing database tables...');

//     // FINAL USERS TABLE: Includes fields for all user types.
//     const usersTableSql = `
//         CREATE TABLE IF NOT EXISTS users (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             email TEXT NOT NULL UNIQUE,
//             password TEXT NOT NULL,
//             role TEXT NOT NULL,
//             subject TEXT, -- For teachers
//             image TEXT,    -- For teachers/profile pictures
//             resetPasswordToken TEXT,
//             resetPasswordExpires INTEGER
//         );
//     `;
    
//     // FINAL STUDENTS TABLE: Includes the link to a parent's user ID.
//     const studentsTableSql = `
//         CREATE TABLE IF NOT EXISTS students (
//             id INTEGER PRIMARY KEY,
//             name TEXT NOT NULL,
//             grade TEXT,
//             enrollmentDate TEXT,
//             birthDate TEXT,
//             gpa TEXT,
//             remarks TEXT,
//             attendance INTEGER,
//             parentId INTEGER,
//             FOREIGN KEY (parentId) REFERENCES users (id) ON DELETE SET NULL
//         );
//     `;
    
//     // The separate 'teachers' table is removed.
//     const teachersTableSql = `CREATE TABLE IF NOT EXISTS teachers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, subject TEXT, email TEXT UNIQUE, image TEXT)`;
    
//     const resultsTableSql = `CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER, subject TEXT, score TEXT, FOREIGN KEY (student_id) REFERENCES students(id))`;
//     const classesTableSql = `CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, teacherId INTEGER, room TEXT, students INTEGER, capacity INTEGER, color TEXT, FOREIGN KEY(teacherId) REFERENCES users(id))`;
//     const feesTableSql = `CREATE TABLE IF NOT EXISTS fees (id INTEGER PRIMARY KEY AUTOINCREMENT, studentId INTEGER, amount REAL, status TEXT, dueDate TEXT, FOREIGN KEY(studentId) REFERENCES students(id))`;
//     const eventsTableSql = `CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, start TEXT, "end" TEXT, backgroundColor TEXT, borderColor TEXT)`;
//     const booksTableSql = `CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, category TEXT, status TEXT, checkedOutTo TEXT, cover TEXT, digitalLink TEXT)`;
//     const contentTableSql = `CREATE TABLE IF NOT EXISTS content (key TEXT PRIMARY KEY, value TEXT)`;
//     const messagesTableSql = `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, channelId TEXT, sender TEXT, subject TEXT, body TEXT, "time" TEXT, isRead INTEGER DEFAULT 0)`;
//     const attendanceTableSql = `CREATE TABLE IF NOT EXISTS attendance_records (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER, date TEXT, status TEXT, UNIQUE(student_id, date) ON CONFLICT REPLACE)`;
//     const applicationsTableSql = `CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthDate TEXT, gradeToEnroll TEXT, previousSchool TEXT, parentName TEXT, parentEmail TEXT, parentPhone TEXT, applicationLetterPath TEXT, status TEXT DEFAULT 'Pending', submissionDate TEXT)`;
//     const newsTableSql = `CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, summary TEXT, imageUrl TEXT, content TEXT, publishDate TEXT)`;
//     const testimonialsTableSql = `CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY AUTOINCREMENT, quote TEXT, author TEXT, relation TEXT)`;
//     const contactMessagesTableSql = `CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, email TEXT, subject TEXT, message TEXT, submissionDate TEXT, isRead INTEGER DEFAULT 0)`;
//     const galleryTableSql = `CREATE TABLE IF NOT EXISTS gallery_items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, type TEXT, mediaUrl TEXT, category TEXT, uploadDate TEXT)`;

//     // Run all the table creation commands
//     db.run(usersTableSql, (err) => {
//         if (err) return console.error(err.message);
//         // Seed the admin user only AFTER the users table is guaranteed to exist.
//         seedAdminUser();
//     });
//     db.run(studentsTableSql);
//     db.run(resultsTableSql);
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
    
//     function seedAdminUser() {
//         const checkAdminSql = `SELECT * FROM users WHERE email = ?`;
//         db.get(checkAdminSql, ['admin'], async (err, row) => {
//             if (err) return console.error("Admin check failed:", err.message);
//             if (!row) {
//                 console.log("No default admin found, creating one...");
//                 const hashedPassword = await bcrypt.hash('password123', 10);
//                 const insertAdminSql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
//                 db.run(insertAdminSql, ['Admin User', 'admin', hashedPassword, 'Admin'], (err) => {
//                     if (err) return console.error("Failed to create admin user:", err.message);
//                     console.log("Default admin user created successfully. Email: admin, Password: password123");
//                 });
//             }
//         });
//     }

//     console.log('Database table initialization process started.');
// });

// module.exports = db;