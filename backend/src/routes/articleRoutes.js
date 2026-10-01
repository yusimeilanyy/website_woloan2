const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// GET /api/articles - Ambil semua artikel
router.get('/', articleController.getAllArticles);

// GET /api/articles/:id - Ambil artikel by ID
router.get('/:id', articleController.getArticleById);

module.exports = router;