const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { verifyToken } = require('../controllers/authController');

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak pengiriman, coba lagi beberapa menit lagi.' }
});

const clean = (v, max) => String(v ?? '').trim().slice(0, max);
const fail = (res, err) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
};

// ================= SURAT =================
const letterRouter = express.Router();
const LETTER_STATUS = ['pending', 'processed', 'rejected'];

letterRouter.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, phone, type, address, purpose, status, submitted_at AS submittedAt
       FROM letter_submissions ORDER BY submitted_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { fail(res, err); }
});

letterRouter.post('/', publicLimiter, async (req, res) => {
  try {
    const name = clean(req.body.name, 150);
    const phone = clean(req.body.phone, 30);
    const type = clean(req.body.type, 150);
    const address = clean(req.body.address, 255);
    const purpose = clean(req.body.purpose, 2000);
    if (!name || !phone || !type || !address || !purpose) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }
    const [result] = await db.query(
      'INSERT INTO letter_submissions (name, phone, type, address, purpose) VALUES (?, ?, ?, ?, ?)',
      [name, phone, type, address, purpose]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { fail(res, err); }
});

letterRouter.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!LETTER_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }
    const [result] = await db.query('UPDATE letter_submissions SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true });
  } catch (err) { fail(res, err); }
});

letterRouter.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM letter_submissions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true });
  } catch (err) { fail(res, err); }
});

// ================= PENGADUAN =================
const complaintRouter = express.Router();
const COMPLAINT_STATUS = ['pending', 'in_progress', 'resolved'];

complaintRouter.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, phone, anonymous, category, location, message, status, submitted_at AS submittedAt
       FROM complaint_submissions ORDER BY submitted_at DESC`
    );
    res.json({ success: true, data: rows.map(r => ({ ...r, anonymous: !!r.anonymous })) });
  } catch (err) { fail(res, err); }
});

complaintRouter.post('/', publicLimiter, async (req, res) => {
  try {
    const anonymous = req.body.anonymous === true;
    const name = anonymous ? null : clean(req.body.name, 150);
    const phone = clean(req.body.phone, 30) || null;
    const category = clean(req.body.category, 100);
    const location = clean(req.body.location, 255) || null;
    const message = clean(req.body.message, 3000);
    if (!category) return res.status(400).json({ success: false, message: 'Kategori wajib dipilih' });
    if (!anonymous && !name) return res.status(400).json({ success: false, message: 'Nama wajib diisi' });
    if (message.length < 20) return res.status(400).json({ success: false, message: 'Isi pengaduan minimal 20 karakter' });
    const [result] = await db.query(
      'INSERT INTO complaint_submissions (name, phone, anonymous, category, location, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, anonymous ? 1 : 0, category, location, message]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { fail(res, err); }
});

complaintRouter.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!COMPLAINT_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }
    const [result] = await db.query('UPDATE complaint_submissions SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true });
  } catch (err) { fail(res, err); }
});

complaintRouter.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM complaint_submissions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true });
  } catch (err) { fail(res, err); }
});

module.exports = { letterRouter, complaintRouter };