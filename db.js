const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'tvradioapp3'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database');
});

module.exports = connection;
