const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Kirim pengajuan surat baru
router.post('/', async (req, res) => {
  try {
    const { requester_name, nik, phone, service_id, purpose } = req.body;
    
    if (!requester_name || !nik || !phone || !service_id || !purpose) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const [results] = await db.query(
      'INSERT INTO letter_requests (requester_name, nik, phone, service_id, purpose, status) VALUES (?, ?, ?, ?, ?, ?)',
      [requester_name, nik, phone, service_id, purpose, 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Pengajuan surat berhasil dikirim! Silakan tunggu konfirmasi dari kelurahan.',
      data: { id: results.insertId }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;