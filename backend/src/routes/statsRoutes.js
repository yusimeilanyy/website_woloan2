const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { verifyToken } = require('../controllers/authController');

// Statistics
router.get('/statistics', statsController.getAllStatistics);
router.post('/statistics', verifyToken, statsController.createStatistic);
router.put('/statistics/:id', verifyToken, statsController.updateStatistic);
router.delete('/statistics/:id', verifyToken, statsController.deleteStatistic);

// Galleries
router.get('/galleries', statsController.getAllGalleries);
router.post('/galleries', verifyToken, statsController.createGallery);
router.put('/galleries/:id', verifyToken, statsController.updateGallery);
router.delete('/galleries/:id', verifyToken, statsController.deleteGallery);

module.exports = router;