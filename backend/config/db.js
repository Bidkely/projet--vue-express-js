const mysql = require('mysql2');
require('dotenv').config();

// Créer le pool de connexions
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'banque_user',
    password: process.env.DB_PASSWORD || 'banque123',
    database: process.env.DB_NAME || 'banque_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify les requêtes pour utiliser async/await
const promisePool = pool.promise();

module.exports = promisePool;