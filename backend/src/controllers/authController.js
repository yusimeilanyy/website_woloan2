const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Admin
exports.login = (req, res) => {
  const { username, password } = req.body;
  
  console.log('🔵 Mencoba login untuk user:', username);

  const sql = 'SELECT * FROM admins WHERE username = ?';
  
  // db.query menggunakan callback, jadi try-catch ditaruh DI DALAM callback
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length === 0) {
      console.log('🔴 User tidak ditemukan');
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const admin = results[0];
    console.log('🟢 User ditemukan:', admin.username);
    
    try {
      // Cek password (ini async, jadi butuh try-catch di sini)
      const isMatch = await bcrypt.compare(password, admin.password);
      console.log('🟢 Password cocok:', isMatch);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Username atau password salah' });
      }

      // Buat token JWT
      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET || 'secret_key_woloan_dua',
        { expiresIn: '24h' }
      );

      console.log('🟢 Login berhasil! Token dibuat.');
      
      res.json({
        success: true,
        message: 'Login berhasil',
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name
        }
      });
    } catch (error) {
      console.error('❌ Error saat cek password:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });
};

// Verify Token Middleware
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'Token tidak ditemukan' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_woloan_dua', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    req.admin = decoded;
    next();
  });
};