const db = require('./config/db');

async function test() {
    console.log('Testing query...');
    try {
        const res = await db.query('SELECT 1 as val');
        console.log('Result:', res.rows[0]);
    } catch (err) {
        console.error('Inner error:', err);
    }
}

console.log('Execution started');
test().then(() => {
    console.log('Execution finished');
    process.exit();
}).catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
