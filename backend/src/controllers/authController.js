const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

<<<<<<< HEAD
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

=======
// ==========================================
// 1. FUNGSI LOGIN ADMIN
// ==========================================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(' Mencoba login untuk user:', username);
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
    }
    
    // Cek admin di database
    const [results] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
    
    const admin = results[0];
    
    // Verifikasi password dengan bcrypt
    const passwordMatch = await bcrypt.compare(password, admin.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role || 'admin' },
      process.env.JWT_SECRET || 'secret_key_woloan_dua',
      { expiresIn: '24h' }
    );
    
    console.log('🟢 Login berhasil untuk:', username);
    
>>>>>>> ab090267735bc2dca223a95230f2c2e1d4e68bc7
    res.json({
      success: true,
      message: 'Login berhasil',
      token,
<<<<<<< HEAD
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('💥 ERROR FATAL:', error);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan server' });
=======
      user: { id: admin.id, username: admin.username, role: admin.role || 'admin' }
    });
  } catch (err) {
    console.error('❌ Error saat login:', err);
    res.status(500).json({ success: false, message: err.message });
>>>>>>> ab090267735bc2dca223a95230f2c2e1d4e68bc7
  }
};

// ==========================================
// 2. MIDDLEWARE: VERIFIKASI TOKEN JWT
// ==========================================
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
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