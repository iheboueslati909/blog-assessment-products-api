'use strict';

function canUpdateArticle(user, article) {
  if (!user) return false;
  if (user.role === "admin" || user.role === "editor") return true;
  if (user.role === "writer" && article.authorId.toString() === user.id) return true;
  return false;
}

function canDeleteArticle(user) {
  return user?.role === "admin";
}

module.exports = {
  canDeleteArticle,
  canUpdateArticle
};
