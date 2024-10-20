const mysql = require('mysql2');

// Konfigurasi koneksi database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'todo_express'
});

// Cek apakah koneksi berhasil
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

const db = connection.promise();

module.exports = db;
