const pool = require('./config/db');
async function checkUsersTable() {
    try {
        const [columns] = await pool.query('DESCRIBE users');
        console.log('Columns in users table:', columns.map(c => c.Field).join(', '));
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}
checkUsersTable();
