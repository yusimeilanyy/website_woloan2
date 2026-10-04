const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. GET semua data statistik
router.get('/statistics', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM statistics ORDER BY id DESC');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET semua data anggaran/budget
router.get('/budget', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM budget ORDER BY id DESC');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET semua data galeri
router.get('/galleries', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM galleries ORDER BY id DESC');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PENTING: Export router agar bisa dipakai di server.js
module.exports = router;