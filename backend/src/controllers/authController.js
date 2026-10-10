const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// 1. FUNGSI LOGIN ADMIN
// ==========================================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('1️⃣ Menerima request login untuk:', username);

    // Validasi input (Tambahan dari versi baru)
    if (!username || !password) {
      console.log('❌ Username atau password kosong');
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
    }

    const sql = 'SELECT * FROM admins WHERE username = ?';
    console.log('2️⃣ Menjalankan query...');

    // db.query() sekarang mengembalikan Promise, jadi pakai await
    const [results] = await db.query(sql, [username]);
    
    console.log('3️⃣ Query selesai! Ditemukan:', results.length, 'baris');

    if (results.length === 0) {
      console.log('❌ User tidak ditemukan');
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    const admin = results[0];
    console.log('4️⃣ User ditemukan:', admin.username);
    console.log('5️⃣ Membandingkan password...');

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('6️⃣ Password cocok:', isMatch);

    if (!isMatch) {
      console.log('❌ Password salah');
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    console.log('7️⃣ Membuat token JWT...');
    
    // Generate JWT token (dengan tambahan role untuk keamanan)
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role || 'admin' },
      process.env.JWT_SECRET || 'secret_key_woloan_dua',
      { expiresIn: '24h' }
    );

    console.log('🎉 8️⃣ LOGIN BERHASIL! Mengirim response...');

    // Response disesuaikan agar kompatibel dengan frontend App.jsx
    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name || 'Administrator',
        role: admin.role || 'admin'
      }
    });

  } catch (error) {
    console.error('💥 ERROR FATAL:', error);
    res.status(500).json({ success: false, message: error.message || 'Terjadi kesalahan server' });
  }
};

// ==========================================
// 2. MIDDLEWARE: VERIFIKASI TOKEN JWT
// ==========================================
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Mendukung format "Bearer TOKEN" atau langsung "TOKEN"
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_woloan_dua', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
    req.admin = decoded;
    next();
  });
};