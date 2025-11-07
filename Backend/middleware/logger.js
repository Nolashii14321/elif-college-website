// Backend/middleware/logger.js
const winston = require('winston');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create Winston logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'elif-college-api' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({ 
            filename: path.join(logsDir, 'error.log'), 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({ 
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
    ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Morgan HTTP request logger
const httpLogger = morgan('combined', {
    stream: {
        write: (message) => {
            logger.info(message.trim());
        }
    }
});

// Custom logging functions
const logError = (error, req = null) => {
    const logData = {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    };
    
    if (req) {
        logData.request = {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user ? req.user.id : null
        };
    }
    
    logger.error(logData);
};

const logInfo = (message, data = {}) => {
    logger.info({
        message,
        ...data,
        timestamp: new Date().toISOString()
    });
};

const logWarning = (message, data = {}) => {
    logger.warn({
        message,
        ...data,
        timestamp: new Date().toISOString()
    });
};

// Security event logging
const logSecurityEvent = (event, req, details = {}) => {
    logger.warn({
        type: 'SECURITY_EVENT',
        event,
        details: {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.url,
            method: req.method,
            userId: req.user ? req.user.id : null,
            ...details
        },
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    logger,
    httpLogger,
    logError,
    logInfo,
    logWarning,
    logSecurityEvent
};


