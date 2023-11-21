const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT article_id,
  title,
  topic,
  author,
  created_at,
  votes,
  article_img_url FROM articles ORDER BY created_at DESC;`
    )
    .then((articles) => {
      return articles;
    });
};

exports.selectArticlesById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return rows;
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT article_id,
  title,
  topic,
  author,
  created_at,
  votes,
  article_img_url FROM articles ORDER BY created_at DESC;`
    )
    .then((articles) => {
      return articles;
    });
};
