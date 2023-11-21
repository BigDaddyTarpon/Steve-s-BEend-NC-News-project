const express = require("express");

const {
  getTopics,
  getArticlesById,
  getEndpoints,
} = require("./controllers/topics.controllers");

const {
  handle404,
  handlePSQLError,
  handleInternalServerError,
  handleCustomError,
} = require("./errorhandling");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.use(handlePSQLError);
app.use(handleCustomError);
app.use(handleInternalServerError);

app.get("/api", getEndpoints);

app.all("/*", handle404);
module.exports = app;
