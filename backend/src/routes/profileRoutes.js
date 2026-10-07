const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../controllers/authController'); // Import untuk proteksi admin

router.get('/info', profileController.getVillageInfo);
router.get('/officials', profileController.getOfficials);
router.get('/institutions', profileController.getInstitutions);

// Routes untuk Peta Desa
router.get('/map', profileController.getMap);
router.put('/map', verifyToken, profileController.updateMap); // Hanya admin yang bisa update

module.exports = router;