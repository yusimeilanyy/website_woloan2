const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// GET /api/services - Ambil semua layanan
router.get('/', serviceController.getServices);

// GET /api/services/:id - Ambil 1 layanan
router.get('/:id', serviceController.getServiceById);

// POST /api/services - Tambah layanan baru
router.post('/', serviceController.createService);

// PUT /api/services/:id - Update layanan
router.put('/:id', serviceController.updateService);

// DELETE /api/services/:id - Hapus layanan
router.delete('/:id', serviceController.deleteService);

module.exports = router;