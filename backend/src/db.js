const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',      // ← PENTING: Ganti 'localhost' jadi '127.0.0.1' agar tidak error IPv6
  user: 'root',
  password: '4kun_database', 
  database: 'db_woloan',
  port: 3307              // ← PENTING: Port sesuai hasil cek tadi
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database gagal terhubung:');
    console.error('Error:', err.message);
    return;
  }
  console.log('✅ Database terhubung!');
});

module.exports = db;