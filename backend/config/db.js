const { Pool } = require('pg');
require('dotenv').config();

console.log('--- Database Connection Attempt ---');
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error('❌ DATABASE_URL is missing in environment variables!');
} else {
    const maskedUrl = dbUrl.replace(/:[^:]*@/, ':****@');
    console.log(`Connecting to: ${maskedUrl}`);
}

const pool = new Pool({
    connectionString: dbUrl,
    connectionTimeoutMillis: 10000, // 10 second timeout
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool
};
