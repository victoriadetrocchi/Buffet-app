const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // <--- Si tienes clave en XAMPP, ponla aquí
    database: 'buffet-app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probamos la conexión inmediatamente
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ ERROR FATAL DE CONEXIÓN:");
        console.error(err.code); // Esto nos dirá si es password, base de datos inexistente, etc.
        console.error(err.message);
    } else {
        console.log("✅ ¡CONEXIÓN EXITOSA!");
        connection.release();
    }
});

module.exports = pool.promise();