const { Pool } = require('pg');
require('dotenv').config();

// Try parsing the password manually or using the object format
const pool = new Pool({
    user: 'postgres',
    host: 'db.rkvqqxndnftkbfvraclz.supabase.co',
    database: 'postgres',
    password: 'Pavani@_123', // Original password from user
    port: 5432,
    connectionTimeoutMillis: 5000,
    ssl: {
        rejectUnauthorized: false
    }
});

const test = async () => {
    try {
        console.log('Testing with object config (password with @)...');
        const res = await pool.query('SELECT NOW()');
        console.log('Success:', res.rows[0]);
    } catch (err) {
        console.error('Connection failed:', err.message || err);
    } finally {
        await pool.end();
    }
};

test();
