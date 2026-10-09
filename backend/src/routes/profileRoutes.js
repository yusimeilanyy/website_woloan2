const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// GET routes
router.get('/info', profileController.getVillageInfo);
router.get('/officials', profileController.getOfficials);
router.get('/map', profileController.getMap);

// PUT routes
router.put('/info', profileController.updateVillageInfo);
router.put('/map', profileController.updateMap);

// CRUD Officials (POST, PUT, DELETE)
router.post('/officials', profileController.addOfficial);
router.put('/officials/:id', profileController.updateOfficial);
router.delete('/officials/:id', profileController.deleteOfficial);

module.exports = router;