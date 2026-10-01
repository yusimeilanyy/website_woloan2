const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/info', profileController.getVillageInfo);
router.get('/officials', profileController.getOfficials);
router.get('/institutions', profileController.getInstitutions);

module.exports = router;