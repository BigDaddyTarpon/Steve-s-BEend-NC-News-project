const { handlePSQLErrors } = require("../errorhandling");
const {
  selectTopics,
  selectArticlesById,
  selectCommentsById,
  selectArticles,
  insertCommentByArticleId,
} = require("../models/topics.models");

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

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
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

exports.addCommentbyArticleID = (req, res, next) => {
  
  const { article_id } = req.params;
const { body, username } = req.body
  //console.log(req.body, "req.body in controller");
  // const body = req.body.body
  // const username = req.body.username;
  console.log(body, "<<<<<<<< body  in controller");
  console.log(username, "<<<<<<<< username  in controller");
  // console.log(article_id, "<<<<<<<< id  in controller");
  insertCommentByArticleId(body, username, article_id)
    .then((comment) => {
      console.log(comment, "comment in controller 56")
      res.status(201).send({ comment });
    })

    .catch((err) => {
      console.log(err, err.code, "<<<<<<<<<<------err in POST controller");
      next(err);
    });
};

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endPoints: appDetails });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectArticlesById(article_id)
    .then(() => {
      return selectCommentsById(article_id);
    })
    .then((rows) => {
      res.status(200).send({ comments: rows });
    })

    .catch((err) => {
      next(err);
    });
};
