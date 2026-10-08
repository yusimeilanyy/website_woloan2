const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route GET
router.get('/info', profileController.getVillageInfo);
router.get('/officials', profileController.getOfficials);
router.get('/institutions', profileController.getInstitutions);
router.get('/map', profileController.getMap);

// Route Peta (PUT)
router.put('/map', profileController.updateMap);

// Route CRUD Perangkat Desa (POST, PUT, DELETE)
router.post('/officials', profileController.addOfficial);
router.put('/officials/:id', profileController.updateOfficial);
router.delete('/officials/:id', profileController.deleteOfficial);

module.exports = router;