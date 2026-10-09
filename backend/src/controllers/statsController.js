const db = require('../db');

// STATISTICS
exports.getAllStatistics = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM statistics ORDER BY id DESC');
    res.json({ success: true, data: results });
  } catch (err) {
    console.error('Error getAllStatistics:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createStatistic = async (req, res) => {
  try {
    console.log('📝 Creating statistic:', req.body);
    const { category, value, year } = req.body;
    if (!category || !value) {
      return res.status(400).json({ success: false, message: 'Kategori dan nilai wajib diisi' });
    }
    const [results] = await db.query(
      'INSERT INTO statistics (category, value, year) VALUES (?, ?, ?)',
      [category, value, year || new Date().getFullYear()]
    );
    res.status(201).json({ 
      success: true, 
      message: 'Statistik berhasil ditambahkan',
      data: { id: results.insertId }
    });
  } catch (err) {
    console.error('Error createStatistic:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateStatistic = async (req, res) => {
  try {
    console.log('✏️ Updating statistic ID:', req.params.id, 'Data:', req.body);
    const { id } = req.params;
    const { category, value, year } = req.body;
    if (!category || !value) {
      return res.status(400).json({ success: false, message: 'Kategori dan nilai wajib diisi' });
    }
    const [results] = await db.query(
      'UPDATE statistics SET category = ?, value = ?, year = ? WHERE id = ?',
      [category, value, year || new Date().getFullYear(), id]
    );
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Statistik berhasil diperbarui' });
  } catch (err) {
    console.error('Error updateStatistic:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteStatistic = async (req, res) => {
  try {
    console.log('️ Deleting statistic ID:', req.params.id);
    const { id } = req.params;
    const [results] = await db.query('DELETE FROM statistics WHERE id = ?', [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Statistik berhasil dihapus' });
  } catch (err) {
    console.error('Error deleteStatistic:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GALLERIES
exports.getAllGalleries = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM galleries ORDER BY id DESC');
    res.json({ success: true, data: results });
  } catch (err) {
    console.error('Error getAllGalleries:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createGallery = async (req, res) => {
  try {
    console.log('📝 Creating gallery:', req.body);
    const { title, image_url } = req.body;
    if (!title || !image_url) {
      return res.status(400).json({ success: false, message: 'Judul dan URL gambar wajib diisi' });
    }
    const [results] = await db.query(
      'INSERT INTO galleries (title, image_url) VALUES (?, ?)',
      [title, image_url]
    );
    res.status(201).json({ 
      success: true, 
      message: 'Foto berhasil ditambahkan',
      data: { id: results.insertId }
    });
  } catch (err) {
    console.error('Error createGallery:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateGallery = async (req, res) => {
  try {
    console.log('️ Updating gallery ID:', req.params.id, 'Data:', req.body);
    const { id } = req.params;
    const { title, image_url } = req.body;
    if (!title || !image_url) {
      return res.status(400).json({ success: false, message: 'Judul dan URL gambar wajib diisi' });
    }
    const [results] = await db.query(
      'UPDATE galleries SET title = ?, image_url = ? WHERE id = ?',
      [title, image_url, id]
    );
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Foto berhasil diperbarui' });
  } catch (err) {
    console.error('Error updateGallery:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    console.log('🗑️ Deleting gallery ID:', req.params.id);
    const { id } = req.params;
    const [results] = await db.query('DELETE FROM galleries WHERE id = ?', [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Foto berhasil dihapus' });
  } catch (err) {
    console.error('Error deleteGallery:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};