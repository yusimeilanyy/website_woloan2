const db = require('../db');

// Ambil statistik
exports.getStatistics = async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM statistics WHERE year = 2026';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    const [results] = await db.query(sql, params);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ambil budget/APBDes
exports.getBudget = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM budget WHERE year = 2026');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ambil galeri
exports.getGalleries = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM galleries ORDER BY created_at DESC');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};