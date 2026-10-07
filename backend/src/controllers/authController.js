const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    
    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: { id: admin.id, username: admin.username, role: admin.role || 'admin' }
    });
  } catch (err) {
    console.error('❌ Error saat login:', err);
    res.status(500).json({ success: false, message: err.message });
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