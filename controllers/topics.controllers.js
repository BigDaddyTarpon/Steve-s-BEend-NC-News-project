const { handlePSQLErrors } = require("../errorhandling");
const { selectTopics, selectArticlesById } = require("../models/topics.models");

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
      if (articles.rowCount === 0) {
        res.status(400).send({ message: "Bad Request" });
      }
      res.status(200).send({ articles: articles.rows[0] });
    })
    .catch((err) => {
      next(err);
    });
};
