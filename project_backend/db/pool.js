const mysql2 = require('mysql2');

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'main_project',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;