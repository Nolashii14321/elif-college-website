// Backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../database');

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            name: user.name 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Verify JWT token middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        next();
    };
};

// Admin only middleware
const adminOnly = authorizeRoles('Admin');

// Teacher or Admin middleware
const teacherOrAdmin = authorizeRoles('Admin', 'Teacher');

// Student, Teacher, or Admin middleware
const studentTeacherOrAdmin = authorizeRoles('Admin', 'Teacher', 'Student');

// Verify user exists in database
const verifyUserExists = async (req, res, next) => {
    try {
        const sql = 'SELECT id, email, role, name FROM users WHERE id = ?';
        db.query(sql, [req.user.id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }
            
            req.user = results[0];
            next();
        });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    generateToken,
    authenticateToken,
    authorizeRoles,
    adminOnly,
    teacherOrAdmin,
    studentTeacherOrAdmin,
    verifyUserExists,
    JWT_SECRET
};


