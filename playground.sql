\c nc_news_test
-- example select * from articles

`INSERT INTO comments(body, author, article_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
      ;`,
      [body, username, article_id]