const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/statistics', statsController.getStatistics);
router.get('/budget', statsController.getBudget);
router.get('/galleries', statsController.getGalleries);

module.exports = router;