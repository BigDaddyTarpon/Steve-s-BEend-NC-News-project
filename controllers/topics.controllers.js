const {
  selectTopics,
  selectArticlesById,
  selectCommentsById,
  selectArticles,
  insertCommentByArticleId,
  removeCommentById,
  checkCommentExists,
  checkArticleIdExists,
  adjustVotes,
  adjustCommentVotes,
  selectAllUsers,
  selectUserByUsername,
  insertArticle,
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
  const { topic } = req.query;
  const sort_by = req.query.sort_by || "created_at";
  const order = req.query.order || "desc";

  selectArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  checkArticleIdExists(article_id)
    .then(() => {
      return selectArticlesById(article_id);
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addCommentbyArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;

  insertCommentByArticleId(body, username, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
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

  checkArticleIdExists(article_id)
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then((rows) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.incrementVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  checkArticleIdExists(article_id)
    .then(() => {
      if (!inc_votes) {
        return Promise.reject({ status: 400, message: "Bad Request" });
      }
      return adjustVotes(article_id, inc_votes);
    })
    .then((updatedArticle) => {
      res.status(202).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserName = (req, res, next) => {
  const { username } = req.params;

  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
  }
exports.addArticle = (req, res, next) => {
  let { author, title, body, topic, article_img_url } = req.body;
  if (!article_img_url) {
    article_img_url = "https://northcoders.com/";
  }

  insertArticle(author, title, body, topic, article_img_url)
    .then((insertedArticle) => {
      const { article_id } = insertedArticle[0];

      return selectArticlesById(article_id);
    })
    .then((articles) => {
      
      res.status(201).send({ articles });

    })
    .catch((err) => {
      next(err);
    });

};

  
exports.incrementVotesByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (Number(comment_id) === NaN) {
    throw { status: 400, message: "Bad Request" };
  }

  checkCommentExists(comment_id)
    .then(() => {
      if (!inc_votes) {
        return Promise.reject({ status: 400, message: "Bad Request" });
      }
      return adjustCommentVotes(comment_id, inc_votes);
    })
    .then((updatedComment) => {
      res.status(202).send({ updatedComment });
    })

    .catch((err) => {
      next(err);
    });
};


