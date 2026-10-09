const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Statistics CRUD
router.get('/statistics', statsController.getAllStatistics);
router.post('/statistics', statsController.createStatistic);
router.put('/statistics/:id', statsController.updateStatistic);
router.delete('/statistics/:id', statsController.deleteStatistic);

// Galleries CRUD
router.get('/galleries', statsController.getAllGalleries);
router.post('/galleries', statsController.createGallery);
router.put('/galleries/:id', statsController.updateGallery);
router.delete('/galleries/:id', statsController.deleteGallery);

module.exports = router;