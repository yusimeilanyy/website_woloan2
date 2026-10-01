const db = require('../db');

// Ambil info kelurahan
exports.getVillageInfo = (req, res) => {
  const sql = 'SELECT * FROM village_info LIMIT 1';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: results[0] });
  });
};

// Ambil semua perangkat desa
exports.getOfficials = (req, res) => {
  const sql = 'SELECT * FROM officials ORDER BY position';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: results });
  });
};

// Ambil semua lembaga desa
exports.getInstitutions = (req, res) => {
  const sql = 'SELECT * FROM institutions';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: results });
  });
};