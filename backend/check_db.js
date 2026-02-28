const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    let output = '';
    const tables = ['users', 'exercises', 'routines', 'routine_exercises', 'workout_history'];
    for (const table of tables) {
        const [columns] = await connection.query(`DESCRIBE ${table}`);
        output += `TABLE: ${table}\n`;
        columns.forEach(c => output += `  COLUMN: ${c.Field}, TYPE: ${c.Type}\n`);
    }
    const fs = require('fs');
    fs.writeFileSync('db_info.txt', output);
    await connection.end();
}

check().catch(console.error);
