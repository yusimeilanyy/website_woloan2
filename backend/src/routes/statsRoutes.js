const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../controllers/authController'); // Import proteksi admin

// ==========================================
// PUBLIC ROUTES (Bisa diakses siapa saja)
// ==========================================

// Statistics CRUD
router.get('/statistics', statsController.getAllStatistics);
router.post('/statistics', statsController.createStatistic);
router.put('/statistics/:id', statsController.updateStatistic);
router.delete('/statistics/:id', statsController.deleteStatistic);

// 2. GET semua data galeri
router.get('/galleries', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM galleries ORDER BY id DESC');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PROTECTED ROUTES (Hanya Admin yang bisa akses)
// ==========================================

// 3. TAMBAH data statistik
router.post('/statistics', verifyToken, async (req, res) => {
  try {
    const { category, value, year } = req.body;
    const [results] = await db.query(
      'INSERT INTO statistics (category, value, year) VALUES (?, ?, ?)',
      [category, value, year]
    );
    res.status(201).json({ success: true, message: 'Statistik berhasil ditambahkan', id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. EDIT data statistik (INI YANG TADI HILANG!)
router.put('/statistics/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, value, year } = req.body;
    
    const [results] = await db.query(
      'UPDATE statistics SET category = ?, value = ?, year = ? WHERE id = ?',
      [category, value, year, id]
    );
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data statistik tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Statistik berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. HAPUS data statistik
router.delete('/statistics/:id', verifyToken, async (req, res) => {
  try {
    const [results] = await db.query('DELETE FROM statistics WHERE id = ?', [req.params.id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Statistik berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. TAMBAH data galeri
router.post('/galleries', verifyToken, async (req, res) => {
  try {
    const { title, image_url } = req.body;
    const [results] = await db.query(
      'INSERT INTO galleries (title, image_url) VALUES (?, ?)',
      [title, image_url]
    );
    res.status(201).json({ success: true, message: 'Foto berhasil ditambahkan', id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. EDIT data galeri
router.put('/galleries/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url } = req.body;
    
    const [results] = await db.query(
      'UPDATE galleries SET title = ?, image_url = ? WHERE id = ?',
      [title, image_url, id]
    );
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data galeri tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Foto berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. HAPUS data galeri
router.delete('/galleries/:id', verifyToken, async (req, res) => {
  try {
    const [results] = await db.query('DELETE FROM galleries WHERE id = ?', [req.params.id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Foto berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;