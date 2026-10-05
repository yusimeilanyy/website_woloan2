const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// GET semua artikel
router.get('/', articleController.getAllArticles);

// GET 1 artikel berdasarkan ID
router.get('/:id', articleController.getArticleById);

// POST tambah artikel baru
router.post('/', articleController.createArticle);

// PUT update artikel
router.put('/:id', articleController.updateArticle);

// DELETE hapus artikel
router.delete('/:id', articleController.deleteArticle);

// PENTING: Export router
module.exports = router;