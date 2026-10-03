const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Village Info
router.get('/', profileController.getVillageInfo);
router.put('/', profileController.updateVillageInfo);

// Officials (Perangkat Desa)
router.get('/officials', profileController.getOfficials);
router.get('/officials/:id', profileController.getOfficialById);
router.post('/officials', profileController.createOfficial);
router.put('/officials/:id', profileController.updateOfficial);
router.delete('/officials/:id', profileController.deleteOfficial);

// Institutions (Lembaga Desa)
router.get('/institutions', profileController.getInstitutions);
router.post('/institutions', profileController.createInstitution);
router.put('/institutions/:id', profileController.updateInstitution);
router.delete('/institutions/:id', profileController.deleteInstitution);

module.exports = router;