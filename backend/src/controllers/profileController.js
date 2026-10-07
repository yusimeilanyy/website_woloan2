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

// ==========================================
// FITUR BARU: PETA DESA
// ==========================================
exports.getMap = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM village_map LIMIT 1');
    res.json({ 
      success: true, 
      data: results[0] || { 
        lat: 1.3333, 
        lng: 124.8333, 
        zoom: 15, 
        address: 'Kelurahan Woloan Dua, Kecamatan Tomohon Barat, Kota Tomohon' 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMap = async (req, res) => {
  try {
    const { lat, lng, zoom, address } = req.body;
    await db.query(
      `INSERT INTO village_map (id, lat, lng, zoom, address) VALUES (1, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE lat=?, lng=?, zoom=?, address=?`,
      [lat, lng, zoom, address, lat, lng, zoom, address]
    );
    res.json({ success: true, message: 'Peta berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};