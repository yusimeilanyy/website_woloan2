const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../controllers/authController');

// GET routes
router.get('/info', profileController.getVillageInfo);
router.get('/officials', profileController.getOfficials);
router.get('/institutions', profileController.getInstitutions);

// TAMBAHKAN INI - Route untuk peta
router.get('/map', profileController.getMap);
router.put('/map', verifyToken, profileController.updateMap);

// POST/PUT/DELETE untuk officials
router.post('/officials', verifyToken, profileController.addOfficial);
router.put('/officials/:id', verifyToken, profileController.updateOfficial);
router.delete('/officials/:id', verifyToken, profileController.deleteOfficial);

// PUT untuk info
router.put('/info', verifyToken, profileController.updateVillageInfo);

module.exports = router;