'use strict';

const express = require('express');
const {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/article.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const storageProvider = require('../services/storage/storage.js');
const { createComment, getComments } = require('../controllers/comment.controller.js');

const router = express.Router();

router.get("/", authMiddleware.authenticate,getArticles);
router.get("/:id", getArticle);

router.post("/", authMiddleware.authenticate, createArticle);
router.put("/:id", authMiddleware.authenticate, updateArticle);
router.delete("/:id", authMiddleware.authenticate, deleteArticle);
router.post('/:articleId/comments', authMiddleware.authenticate, createComment);
router.get('/:articleId/comments', getComments);

module.exports = router;