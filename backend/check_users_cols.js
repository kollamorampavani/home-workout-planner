const pool = require('./config/db');
async function checkUsersTable() {
    try {
        const [columns] = await pool.query('DESCRIBE users');
        console.log(JSON.stringify(columns, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkUsersTable();
