const db = require('../db');

exports.getVillageInfo = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM village_info LIMIT 1');
    res.json({ success: true, data: results[0] || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOfficials = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM officials ORDER BY position');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInstitutions = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM institutions');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  