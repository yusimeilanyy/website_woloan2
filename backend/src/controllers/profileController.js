const db = require('../db');

// ==================== VILLAGE INFO ====================

// Ambil info kelurahan
exports.getVillageInfo = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM village_info LIMIT 1');
    res.json({ success: true, data: results[0] || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update info kelurahan
exports.updateVillageInfo = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Nama kelurahan wajib diisi' });
    }
    
    // Cek apakah data sudah ada
    const [existing] = await db.query('SELECT id FROM village_info LIMIT 1');
    
    if (existing.length > 0) {
      // Update data yang ada
      const [results] = await db.query(
        'UPDATE village_info SET name = ?, description = ?, address = ?, phone = ? WHERE id = ?',
        [name, description || null, address || null, phone || null, existing[0].id]
      );
      res.json({ success: true, message: 'Info kelurahan berhasil diperbarui' });
    } else {
      // Insert data baru
      const [results] = await db.query(
        'INSERT INTO village_info (name, description, address, phone) VALUES (?, ?, ?, ?)',
        [name, description || null, address || null, phone || null]
      );
      res.status(201).json({ success: true, message: 'Info kelurahan berhasil ditambahkan' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== OFFICIALS ====================

// Ambil semua perangkat desa
exports.getOfficials = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM officials ORDER BY position');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ambil 1 perangkat desa berdasarkan ID
exports.getOfficialById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('SELECT * FROM officials WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Perangkat desa tidak ditemukan' });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tambah perangkat desa baru
exports.createOfficial = async (req, res) => {
  try {
    const { name, position, photo } = req.body;
    
    if (!name || !position) {
      return res.status(400).json({ error: 'Nama dan jabatan wajib diisi' });
    }
    
    const [results] = await db.query(
      'INSERT INTO officials (name, position, photo) VALUES (?, ?, ?)',
      [name, position, photo || null]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Perangkat desa berhasil ditambahkan',
      data: { id: results.insertId, name, position, photo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update perangkat desa
exports.updateOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, photo } = req.body;
    
    if (!name || !position) {
      return res.status(400).json({ error: 'Nama dan jabatan wajib diisi' });
    }
    
    const [results] = await db.query(
      'UPDATE officials SET name = ?, position = ?, photo = ? WHERE id = ?',
      [name, position, photo || null, id]
    );
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Perangkat desa tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Perangkat desa berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hapus perangkat desa
exports.deleteOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('DELETE FROM officials WHERE id = ?', [id]);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Perangkat desa tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Perangkat desa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== INSTITUTIONS ====================

// Ambil semua lembaga desa
exports.getInstitutions = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM institutions');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tambah lembaga desa baru
exports.createInstitution = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Nama lembaga wajib diisi' });
    }
    
    const [results] = await db.query(
      'INSERT INTO institutions (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Lembaga desa berhasil ditambahkan',
      data: { id: results.insertId, name, description }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update lembaga desa
exports.updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Nama lembaga wajib diisi' });
    }
    
    const [results] = await db.query(
      'UPDATE institutions SET name = ?, description = ? WHERE id = ?',
      [name, description || null, id]
    );
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Lembaga desa tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Lembaga desa berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hapus lembaga desa
exports.deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('DELETE FROM institutions WHERE id = ?', [id]);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Lembaga desa tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Lembaga desa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};