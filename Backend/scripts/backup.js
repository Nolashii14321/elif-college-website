// Backend/scripts/backup.js
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const backupDatabase = async () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'school_db'
    });

    try {
        console.log('Starting database backup...');
        
        // Create backup directory if it doesn't exist
        const backupDir = path.join(__dirname, '..', 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Generate backup filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

        // Get all tables
        const [tables] = await connection.promise().query('SHOW TABLES');
        
        let backupContent = `-- Database backup created on ${new Date().toISOString()}\n`;
        backupContent += `-- Database: ${process.env.DB_NAME || 'school_db'}\n\n`;
        backupContent += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

        for (const table of tables) {
            const tableName = Object.values(table)[0];
            console.log(`Backing up table: ${tableName}`);
            
            // Get table structure
            const [createTable] = await connection.promise().query(`SHOW CREATE TABLE \`${tableName}\``);
            backupContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
            backupContent += `${createTable[0]['Create Table']};\n\n`;
            
            // Get table data
            const [rows] = await connection.promise().query(`SELECT * FROM \`${tableName}\``);
            
            if (rows.length > 0) {
                const columns = Object.keys(rows[0]);
                backupContent += `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES\n`;
                
                const values = rows.map(row => {
                    const rowValues = columns.map(col => {
                        const value = row[col];
                        if (value === null) return 'NULL';
                        if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
                        return value;
                    });
                    return `(${rowValues.join(', ')})`;
                });
                
                backupContent += values.join(',\n') + ';\n\n';
            }
        }

        backupContent += `SET FOREIGN_KEY_CHECKS = 1;\n`;

        // Write backup file
        fs.writeFileSync(backupFile, backupContent);
        
        console.log(`Backup completed: ${backupFile}`);
        
        // Clean up old backups (keep only last 7 days)
        const files = fs.readdirSync(backupDir);
        const now = Date.now();
        const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
        
        files.forEach(file => {
            if (file.startsWith('backup-') && file.endsWith('.sql')) {
                const filePath = path.join(backupDir, file);
                const stats = fs.statSync(filePath);
                
                if (stats.mtime.getTime() < sevenDaysAgo) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted old backup: ${file}`);
                }
            }
        });

    } catch (error) {
        console.error('Backup failed:', error);
        process.exit(1);
    } finally {
        connection.end();
    }
};

// Run backup if called directly
if (require.main === module) {
    backupDatabase();
}

module.exports = { backupDatabase };


