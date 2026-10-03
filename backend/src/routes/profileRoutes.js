const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// GET /api/profile - Info kelurahan
router.get('/', profileController.getVillageInfo);

// GET /api/profile/officials - Perangkat desa
router.get('/officials', profileController.getOfficials);

// GET /api/profile/institutions - Lembaga desa
router.get('/institutions', profileController.getInstitutions);

module.exports = router;