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
    .query(
      `SELECT 
    articles.article_id, 
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    article_img_url,
    articles.body,

     
    
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    JOIN comments 
    ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
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

exports.checkArticleIdExists = (article_id) => {
  return db
    .query(
      `SELECT 
    articles.article_id 
    FROM articles
    WHERE articles.article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }

      return rows;
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id=$1;`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }

      return rows;
    });
};

exports.adjustVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles 
      SET votes = votes + $1  
      WHERE article_id = $2 
      RETURNING *
      ;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      next(err);
    });
};

exports.selectAllUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};
