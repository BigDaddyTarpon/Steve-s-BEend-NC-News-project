const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT 
      articles.article_id, 
      title,
      topic,
      articles.author,
      articles.created_at,
      articles.votes,
      article_img_url, 
      
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;`
    )
    .then((articles) => {
      return articles.rows;
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

exports.selectCommentsById = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.insertCommentByArticleId = (body, username, article_id) => {
  return db
    .query(
      `INSERT INTO comments(body, author, article_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
      ;`,
      [body, username, article_id]
    )

    .then(({ rows }) => {
      return rows[0];
    });
};
exports.selectAllUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};
