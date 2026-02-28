const db = require('./config/db');

const checkTables = async () => {
    try {
        const result = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables found:', result.rows.map(r => r.table_name));
    } catch (error) {
        console.error('Check failed:', error.message);
    } finally {
        process.exit();
    }
};

checkTables();
