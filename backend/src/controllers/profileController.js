const db = require('../db');

// ==========================================
// 1. GET DATA PROFIL & PERANGKAT
// ==========================================
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
// 2. FITUR PETA DESA
// ==========================================
exports.getMap = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM village_map LIMIT 1');
    res.json({ 
      success: true, 
      data: results[0] || { 
        lat: 1.3333, lng: 124.8333, zoom: 15, 
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

// ==========================================
// 3. FITUR CRUD PERANGKAT DESA (BARU)
// ==========================================

// Tambah Perangkat
exports.addOfficial = async (req, res) => {
  try {
    const { name, position, photo } = req.body;
    if (!name || !position) {
      return res.status(400).json({ success: false, message: 'Nama dan jabatan wajib diisi' });
    }
    const [results] = await db.query(
      'INSERT INTO officials (name, position, photo) VALUES (?, ?, ?)',
      [name, position, photo || null]
    );
    res.status(201).json({ 
      success: true, 
      message: 'Perangkat berhasil ditambahkan',
      data: { id: results.insertId, name, position }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update/Edit Perangkat
exports.updateOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, photo } = req.body;
    
    const [results] = await db.query(
      'UPDATE officials SET name = ?, position = ?, photo = ? WHERE id = ?',
      [name, position, photo || null, id]
    );
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data perangkat tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Perangkat berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Hapus Perangkat
exports.deleteOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('DELETE FROM officials WHERE id = ?', [id]);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data perangkat tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Perangkat berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};