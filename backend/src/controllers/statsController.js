const db = require('../db');

// Ambil statistik
exports.getStatistics = (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM statistics WHERE year = 2026';
  if (category) sql += ` AND category = '${category}'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: results });
  });
};

// Ambil budget/APBDes
exports.getBudget = (req, res) => {
  const sql = 'SELECT * FROM budget WHERE year = 2026';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: results });
  });
};

// Ambil galeri
exports.getGalleries = (req, res) => {
  const sql = 'SELECT * FROM galleries ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: results });
  });
};