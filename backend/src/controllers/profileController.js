const db = require('../db');

// ==========================================
// 1. INFORMASI KELURAHAN (VILLAGE INFO)
// ==========================================
exports.getVillageInfo = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM village_info LIMIT 1');
    res.json({ success: true, data: results[0] || null });
  } catch (err) {
    console.error('Error getVillageInfo:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateVillageInfo = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;
    await db.query(
      `INSERT INTO village_info (id, name, description, address, phone) VALUES (1, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=?, description=?, address=?, phone=?`,
      [name, description, address, phone, name, description, address, phone]
    );
    res.json({ success: true, message: 'Profil kelurahan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 2. PERANGKAT DESA (OFFICIALS)
// ==========================================
exports.getOfficials = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;
    await db.query(
      'UPDATE village_info SET name = ?, description = ?, address = ?, phone = ? WHERE id = 1',
      [name, description, address, phone]
    );
    res.json({ success: true, message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error('Error updateVillageInfo:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addOfficial = async (req, res) => {
  try {
    const { name, position } = req.body;
    const [results] = await db.query(
      'INSERT INTO officials (name, position) VALUES (?, ?)',
      [name, position]
    );
    res.status(201).json({ success: true, message: 'Perangkat berhasil ditambahkan', id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position } = req.body;
    const [results] = await db.query(
      'UPDATE officials SET name = ?, position = ? WHERE id = ?',
      [name, position, id]
    );
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data perangkat tidak ditemukan' });
    }
    res.json({ success: true, message: 'Perangkat berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('DELETE FROM officials WHERE id = ?', [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data perangkat tidak ditemukan' });
    }
    res.json({ success: true, message: 'Perangkat berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 3. LEMBAGA / INSTITUSI
// ==========================================
exports.getInstitutions = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM institutions');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 4. PETA DESA (MAP)
// ==========================================
exports.getMap = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM village_map LIMIT 1');
    res.json({ 
      success: true, 
      data: results[0] || { 
        lat: 1.315820000424215, 
        lng: 124.80444529717123, 
        zoom: 16, 
        address: 'Kelurahan Woloan Dua, Kecamatan Tomohon Barat, Kota Tomohon, Sulawesi Utara' 
      } 
    });
  } catch (err) {
    console.error('Error getMap:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE Map
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
    console.error('Error updateMap:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET Officials
exports.getOfficials = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM officials ORDER BY id ASC');
    res.json({ success: true, data: results });
  } catch (err) {
    console.error('Error getOfficials:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ADD Official
exports.addOfficial = async (req, res) => {
  try {
    console.log('📝 Adding official:', req.body);
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
    console.error('Error addOfficial:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE Official
exports.updateOfficial = async (req, res) => {
  try {
    console.log('✏️ Updating official ID:', req.params.id, 'Data:', req.body);
    const { id } = req.params;
    const { name, position, photo } = req.body;
    if (!name || !position) {
      return res.status(400).json({ success: false, message: 'Nama dan jabatan wajib diisi' });
    }
    const [results] = await db.query(
      'UPDATE officials SET name = ?, position = ?, photo = ? WHERE id = ?',
      [name, position, photo || null, id]
    );
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Perangkat berhasil diperbarui' });
  } catch (err) {
    console.error('Error updateOfficial:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE Official
exports.deleteOfficial = async (req, res) => {
  try {
    console.log('🗑️ Deleting official ID:', req.params.id);
    const { id } = req.params;
    const [results] = await db.query('DELETE FROM officials WHERE id = ?', [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Perangkat berhasil dihapus' });
  } catch (err) {
    console.error('Error deleteOfficial:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};