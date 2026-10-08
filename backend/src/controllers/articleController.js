const db = require('../db');

// 1. Ambil semua artikel
exports.getAllArticles = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM articles ORDER BY id DESC');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Ambil 1 artikel berdasarkan ID
exports.getArticleById = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: results[0] || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Tambah artikel baru
exports.createArticle = async (req, res) => {
  try {
    const { title, content, author, image_url } = req.body;
    const [results] = await db.query(
      'INSERT INTO articles (title, content, author, image_url) VALUES (?, ?, ?, ?)',
      [title, content, author || null, image_url || null]
    );
    res.status(201).json({ 
      success: true, 
      message: 'Artikel berhasil ditambahkan',
      data: { id: results.insertId }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update artikel
exports.updateArticle = async (req, res) => {
  try {
    const { title, content, author, image_url } = req.body;
    const [results] = await db.query(
      'UPDATE articles SET title = ?, content = ?, author = ?, image_url = ? WHERE id = ?',
      [title, content, author || null, image_url || null, req.params.id]
    );
    res.json({ success: true, message: 'Artikel berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Hapus artikel
exports.deleteArticle = async (req, res) => {
  try {
    const [results] = await db.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }
    res.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};