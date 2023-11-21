
const { handlePSQLErrors } = require("../errorhandling");
const { selectTopics, selectArticlesById } = require("../models/topics.models");

const { selectTopics } = require("../models/topics.models");
const appDetails = require("../endpoints.json");


exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })

    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endPoints: appDetails });
};
