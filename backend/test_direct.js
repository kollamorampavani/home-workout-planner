const { Client } = require('pg');
require('dotenv').config();

async function run() {
    console.log('Creating client...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected!');
        const res = await client.query('SELECT 1 as val');
        console.log('Result:', res.rows[0]);
    } catch (err) {
        console.error('Error during test:', err);
    } finally {
        await client.end();
    }
}

run().catch(err => {
    console.error('Crashed:', err);
});
