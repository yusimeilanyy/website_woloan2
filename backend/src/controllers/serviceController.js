const db = require('../db');

// 1. Ambil semua layanan
exports.getServices = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM services ORDER BY id DESC');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Ambil 1 layanan berdasarkan ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Layanan tidak ditemukan' });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Tambah layanan baru
exports.createService = async (req, res) => {
  try {
    const { name, description, requirements } = req.body;
    
    // Validasi input
    if (!name || !description) {
      return res.status(400).json({ error: 'Nama dan deskripsi wajib diisi' });
    }
    
    const [results] = await db.query(
      'INSERT INTO services (name, description, requirements) VALUES (?, ?, ?)',
      [name, description, requirements || null]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Layanan berhasil ditambahkan',
      data: { id: results.insertId, name, description, requirements }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update layanan
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, requirements } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Nama dan deskripsi wajib diisi' });
    }
    
    const [results] = await db.query(
      'UPDATE services SET name = ?, description = ?, requirements = ? WHERE id = ?',
      [name, description, requirements || null, id]
    );
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Layanan tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Layanan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Hapus layanan
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('DELETE FROM services WHERE id = ?', [id]);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Layanan tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Layanan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};