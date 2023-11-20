const express = require("express");

const { getTopics } = require("./controllers/topics.controllers");

const { handle404, handlePSQLErrors, handleInternalServerError } = require("./errorhandling");

const app = express();

app.get("/api/topics", getTopics);






app.all("/*", handle404);
module.exports = app 