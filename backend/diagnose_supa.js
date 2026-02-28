const db = require('./config/db');
async function diagnose() {
    try {
        console.log('Checking "users" table...');
        const res = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
        if (res.rows.length === 0) {
            console.error('❌ ERROR: Table "users" does not exist in Supabase!');
        } else {
            console.log('✅ "users" table found. Columns:', res.rows.map(c => c.column_name).join(', '));
        }
    } catch (err) {
        console.error('❌ CONNECTION ERROR:', err.message);
    } finally {
        process.exit();
    }
}
diagnose();
