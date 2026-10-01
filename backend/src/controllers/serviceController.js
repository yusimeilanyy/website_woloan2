const db = require('../db');

// Ambil semua layanan
exports.getServices = (req, res) => {
  const sql = 'SELECT * FROM services';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: results });
  });
};

// Submit pengajuan surat
exports.submitLetterRequest = (req, res) => {
  const { requester_name, nik, phone, service_id, purpose } = req.body;
  const sql = 'INSERT INTO letter_requests (requester_name, nik, phone, service_id, purpose) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [requester_name, nik, phone, service_id, purpose], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Pengajuan berhasil dikirim' });
  });
};