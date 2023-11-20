const express = require("express");

const { getTopics, getEndpoints } = require("./controllers/topics.controllers");

const {
  handle404,
  handlePSQLErrors,
  handleInternalServerError,
} = require("./errorhandling");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.all("/*", handle404);
module.exports = app;
