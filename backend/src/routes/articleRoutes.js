const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { verifyToken } = require('../controllers/authController');

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', verifyToken, articleController.createArticle);
router.put('/:id', verifyToken, articleController.updateArticle);
router.delete('/:id', verifyToken, articleController.deleteArticle);

module.exports = router;