const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
  // Koneksi ke database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_woloan',
    port: process.env.DB_PORT || 3306
  });

  console.log('✅ Terhubung ke database');

  // Generate hash bcrypt untuk password "admin123"
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('🔐 Hash password:', hashedPassword);

  // Cek apakah tabel admins ada, jika tidak buat
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tabel admins siap');

  // Hapus admin lama (jika ada)
  await connection.query('DELETE FROM admins WHERE username = ?', ['admin']);
  console.log('️ Admin lama dihapus');

  // Insert admin baru dengan password yang sudah di-hash
  await connection.query(
    'INSERT INTO admins (username, password, role) VALUES (?, ?, ?)',
    ['admin', hashedPassword, 'admin']
  );
  console.log('✅ Admin baru berhasil dibuat!');
  console.log('   Username: admin');
  console.log('   Password: admin123');

  await connection.end();
  console.log('🔒 Koneksi database ditutup');
}

createAdmin().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});