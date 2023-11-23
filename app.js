const express = require("express");

const {
  getTopics,
  getArticles,
  getArticlesById,
  getEndpoints,
  getComments,
  addCommentbyArticleID,
} = require("./controllers/topics.controllers");

const {
  handle404,
  handlePSQLError,
  handleInternalServerError,
  handleCustomError,
} = require("./errorhandling");

const app = express();
app.post("/api/articles/:article_id/comments", addCommentbyArticleID);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get("/api", getEndpoints);
app.all("/*", handle404);

app.use(handlePSQLError);
app.use(handleCustomError);
app.use(handleInternalServerError);

module.exports = app;
