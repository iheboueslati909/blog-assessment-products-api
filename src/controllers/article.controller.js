'use strict';

const Article = require("../models/article.js");
const { canUpdateArticle, canDeleteArticle } = require("../middlewares/permissions.middleware.js");
const storageProvider = require("../services/storage/storage.js");

//Un utilisateur peut créer un article
async function createArticle(req, res, next) {
  try {
    const imageUrl = req.file ? storageProvider.getFileUrl(req.file) : null;

    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      image: imageUrl,
      tags: req.body.tags ? req.body.tags.split(',') : [],
      authorId: req.user.id,
    });

    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getArticles(req, res, next) {
  try {
    const { tag, author, page = 1, limit = 10 } = req.query;
    const query = {};
    if (tag) query.tags = tag;
    if (author) query.authorId = author;

    const articles = await Article.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getArticle(req, res, next) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Un Éditeur ou un Admin peut modifier n’importe quel article.
//Un Rédacteur peut uniquement modifier ses propres articles.
async function updateArticle(req, res, next) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Not found" });

    if (!canUpdateArticle(req.user, article)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    Object.assign(article, req.body);
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

//Seul un Admin peut supprimer des articles.
async function deleteArticle(req, res, next) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Not found" });

    if (!canDeleteArticle(req.user)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await article.deleteOne();
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
    deleteArticle,
    updateArticle,
    getArticle,
    getArticles,
    createArticle
};