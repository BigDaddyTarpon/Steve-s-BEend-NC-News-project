const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticlesById = (article_id) =>{
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((articles) => {
        return articles.rows[0];
      });
}
