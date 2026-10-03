   const express = require('express');
   const router = express.Router();
   const articleController = require('../controllers/articleController');

   router.get('/', articleController.getAllArticles);
   router.get('/:id', articleController.getArticleById);
   router.post('/', articleController.createArticle);       // Rute untuk menambah
   router.put('/:id', articleController.updateArticle);     // Rute untuk mengubah
   router.delete('/:id', articleController.deleteArticle);  // Rute untuk menghapus

   module.exports = router;