const express = require("express");
const cors = require('cors');
const {
  getTopics,
  getArticles,
  getArticlesById,
  getEndpoints,
  getCommentsByArticleId,
  addCommentbyArticleID,
  deleteCommentById,
  incrementVotesByArticleId,
  incrementVotesByCommentId,
  getAllUsers,
  getUserName,
  addArticle,

} = require("./controllers/topics.controllers");
const {
  handle404,
  handlePSQLError,
  handleInternalServerError,
  handleCustomError,
} = require("./errorhandling");


const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getAllUsers);
app.get("/api/users/:username", getUserName)


app.post("/api/articles/:article_id/comments", addCommentbyArticleID);
app.post("/api/articles", addArticle)
app.patch("/api/articles/:article_id", incrementVotesByArticleId);
app.patch("/api/comments/:comment_id", incrementVotesByCommentId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handlePSQLError);
app.use(handleCustomError);
app.use(handleInternalServerError);
app.all("/*", handle404);

module.exports = app;
