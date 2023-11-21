const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticles = () => {
  return db.query(`SELECT article_id,
  title,
  topic,
  author,
  created_at,
  votes,
  article_img_url FROM articles ORDER BY created_at DESC;`).then((articles) => {
    return articles;
  });
};

