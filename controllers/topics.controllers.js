const { selectTopics, selectArticles } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })

    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      //console.log(articles.rows, "articles.rows in control 17")
      res.status(200).send({articles})
    })
    .catch((err) => {
      console.log(err, "<--err catch in control");
      next(err);
    });
};
