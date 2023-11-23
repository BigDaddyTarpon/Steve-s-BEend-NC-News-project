const { handlePSQLErrors } = require("../errorhandling");
const {
  selectTopics,
  selectArticlesById,
  selectCommentsById,
  selectArticles,
  adjustVotes,
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

exports.incrementVotesByArticleId = (req, res, next) =>{
 const { article_id } = req.params
 const { inc_votes } = res.body
adjustVotes(article_id, inc_vote)
.then((updatedArticle)=>{
  res.status(202).send({ updatedArticle });

})
.catch((err) => {
  next(err);
})

}
