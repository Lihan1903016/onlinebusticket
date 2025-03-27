const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool to manage multiple connections efficiently
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify for async/await
const promisePool = pool.promise();

// Test the database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('MySQL Connected!');
        connection.release(); // Always release the connection when done
    }
});

module.exports = promisePool;