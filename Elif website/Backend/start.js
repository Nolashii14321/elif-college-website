// Backend/start.js
// Simple startup script that checks environment and starts server

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Elif College Server...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  Warning: .env file not found');
    console.log('ℹ️  Using environment variables from hosting provider\n');
}

// Check required environment variables
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = [];

requiredVars.forEach(varName => {
    if (!process.env[varName]) {
        missingVars.push(varName);
    }
});

if (missingVars.length > 0) {
    console.log('⚠️  Warning: Missing environment variables:');
    missingVars.forEach(varName => {
        console.log(`   - ${varName}`);
    });
    console.log('\nℹ️  Make sure to set these in your hosting platform\n');
}

// Start the server
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🌐 Port:', process.env.PORT || 3000);
console.log('');

require('./server.js');
