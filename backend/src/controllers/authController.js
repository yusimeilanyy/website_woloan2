const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Admin - MENGGUNAKAN ASYNC/AWAIT (karena db.js pakai pool.promise())
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('1️⃣ Menerima request login untuk:', username);

    const sql = 'SELECT * FROM admins WHERE username = ?';
    console.log('2️⃣ Menjalankan query...');

    // db.query() sekarang mengembalikan Promise, jadi pakai await
    const [results] = await db.query(sql, [username]);
    
    console.log('3️⃣ Query selesai! Ditemukan:', results.length, 'baris');

    if (results.length === 0) {
      console.log(' User tidak ditemukan');
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const admin = results[0];
    console.log('4️⃣ User ditemukan:', admin.username);
    console.log('5️⃣ Membandingkan password...');

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('6️⃣ Password cocok:', isMatch);

    if (!isMatch) {
      console.log('❌ Password salah');
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    console.log('7️⃣ Membuat token JWT...');
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'secret_key_woloan_dua',
      { expiresIn: '24h' }
    );

    console.log('🎉 8️ LOGIN BERHASIL! Mengirim response...');

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
    console.error('💥 ERROR FATAL:', error);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan server' });
  }
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