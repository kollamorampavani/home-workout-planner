const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);

    let output = '';
    for (const name of tableNames) {
        const [create] = await connection.query(`SHOW CREATE TABLE ${name}`);
        output += `--- ${name} ---\n${create[0]['Create Table']}\n\n`;
    }

    const fs = require('fs');
    fs.writeFileSync('schema_debug.txt', output);
    await connection.end();
}

check().catch(console.error);
