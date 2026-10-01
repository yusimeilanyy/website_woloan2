const db = require('../db');

// Ambil semua artikel
exports.getAllArticles = (req, res) => {
  const sql = 'SELECT * FROM articles ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, data: results });
  });
};

// Ambil artikel berdasarkan ID
exports.getArticleById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM articles WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan' });
    }
    res.json({ success: true, data: results[0] });
  });
};