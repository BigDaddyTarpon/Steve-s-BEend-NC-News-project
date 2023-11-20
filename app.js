const express = require("express");

const { getTopics, getArticlesById, } = require("./controllers/topics.controllers");

const { handle404, handlePSQLErrors, handleInternalServerError } = require("./errorhandling");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);





app.get("/api/articles/:article_id", getArticlesById)




app.all("/*", handle404);
module.exports = app 