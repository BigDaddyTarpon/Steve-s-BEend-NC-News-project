const express = require("express");

const { getTopics } = require("./controllers/topics.controllers");
// gonna require errorhandling.js here
//eg const { handle404, handlePSQLErrors, handleServerError } = require("./errorhandling");

const app = express();

app.get("/api/topics", getTopics);

module.exports = app 