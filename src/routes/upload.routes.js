'use strict';

const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const storageProvider = require('../services/storage/storage.js'); // Added this line
const {
  createArticle,
} = require('../controllers/article.controller.js');

const router = express.Router();

router.post(
  '/',
  authMiddleware.authenticate,
  storageProvider.upload.single('image'),
  createArticle
);

module.exports = router;