const db = require('../db');

// Ambil semua layanan
exports.getServices = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM services');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit pengajuan surat
exports.submitLetterRequest = async (req, res) => {
  try {
    const { requester_name, nik, phone, service_id, purpose } = req.body;
    const [results] = await db.query(
      'INSERT INTO letter_requests (requester_name, nik, phone, service_id, purpose) VALUES (?, ?, ?, ?, ?)',
      [requester_name, nik, phone, service_id, purpose]
    );
    res.status(201).json({ 
      success: true, 
      message: 'Pengajuan berhasil dikirim',
      data: { id: results.insertId }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};