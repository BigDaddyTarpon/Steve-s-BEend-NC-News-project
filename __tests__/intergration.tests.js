const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endPoints = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  test("GET: 200 returns status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("GET: 200 returns an array of correct length with elements consisting of each topic", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const expected = [
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ];
        expect(response.body.topics.length).toBe(3);
        expect(response.body.topics).toEqual(expected);
      });
  });
});

describe("GET non existent endpoint", () => {
  test("GET: 404 returns response with message", () => {
    return request(app)
      .get("/badendpoint")
      .expect(404)
      .then((response) => {
        const message = response.body.message;

        expect(message).toBe("Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET: 200 returns status 200", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("GET: 200 returns an array of all articles including a comment_count but without body property", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        expect(typeof response.body.articles.body).toBe("undefined");

        for (article of response.body.articles) {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        }
      });
  });

  test("GET: 200 if optional query for topics is present filter articles by topic, otherwise returning all articles", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(4);
      });
  });

  test("GET: 200 filtered articles should all have correct topic property to match the filter", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("GET: 200 should return empty array when filter topic is valid but does not exist", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(0);
      });
  });

  test("GET: 200 returns articles sorted by date in DESC order", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("GET: 200 has optional sort_by query which returns articles sorted by query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy(
          response.body.articles.title
        );
      });
  });

  test("GET: 200 has optional order query with a default desc which returns articles sorted in order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=asc")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy(
          response.body.articles.title
        );
      });
  });

  test("GET: 400 if order query is invalid returns 404 and error message", () => {
    return request(app)
      .get("/api/articles?order=banana")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("GET: 400 if given a valid topic with order query that is invalid returns 404 and error message", () => {
    return request(app)
      .get("/api/articles?topic=mitch&order=banana")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("GET: 400 if search_by query is invalid returns 404 and error message", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("GET: 400 if given a valid topic with search_by query that is invalid returns 400 and error message", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=banana")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET: 200 returns the article with appropriate properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const testArticle = response.body.articles[0];
        expect(testArticle.article_id).toBe(1);
        expect(testArticle.votes).toBe(100);
        expect(testArticle.author).toBe("butter_bridge");
        expect(testArticle.title).toBe("Living in the shadow of a great man");
        expect(testArticle.body).toBe("I find this existence challenging");
        expect(testArticle.topic).toBe("mitch");
        expect(typeof testArticle.created_at).toBe("string");
        expect(typeof testArticle.article_img_url).toBe("string");
      });
  });

  test("GET: 404 returns error code and message when id is valid but doesnt exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });

  test("GET: 200 should now have comment count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.articles[0].comment_count).toBe("11");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("GET: 200 returns a single user object with the correct properties", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((response) => {
        expect(response.body.user.length).toBe(1);
        expect(response.body.user[0]).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });

  test("GET: 404 returns an error message but does not accept SQL injection when the username is an invalid attempt to inject SQL code", () => {
    return request(app)
      .get("/api/users/`DELETE * FROM users where user.username=lurker`")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });

  test("GET: 404 returns an error message when the username is valid but does not exist", () => {
    return request(app)
      .get("/api/users/XXXX")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 400 returns error code and message when id is not valid", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("GET: 404 returns error code and message when id is valid but doesnt exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
});

describe("POST /api/articles", () => {
  test("Post: 201 accepts an object with specific article properties, returns the complete posted article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "mitch got a new cat",
        body: "he caught a big one",
        topic: "cats",
        article_img_url:
          "https://www.shutterstock.com/image-photo/big-fish-trophy-arctic-char-charr-2091386731",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.articles[0]).toMatchObject({
          article_id: 14,
          title: "mitch got a new cat",
          topic: "cats",
          author: "butter_bridge",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://www.shutterstock.com/image-photo/big-fish-trophy-arctic-char-charr-2091386731",
          body: "he caught a big one",
          comment_count: "0",
        });
      });
  });

  test("POST: 400 should return Bad Request for missing input fields", () => {
    return request(app)
      .post("/api/articles")
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("POST; 404 returns error message when the topic field is not a permitted value", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "mitch got a new cat",
        body: "he caught a big one",
        topic: "fishing",
        article_img_url:
          "https://www.shutterstock.com/image-photo/big-fish-trophy-arctic-char-charr-2091386731",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });

  test("POST: 400 should return Bad Request for invalid article id input", () => {
    return request(app)
      .post("/api/articles")
      .send({
        body: "testing, testing, 123!",
        username: "butter_bridge",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("POST: 404 should return Not Found if valid but not existing article_id", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        body: "testing, testing, 123!",
        username: "butter_bridge",

        author: "sneaky",
        title: "mitch got a new cat",
        body: "he caught a big one",
        topic: "cats",
        article_img_url:
          "https://www.shutterstock.com/image-photo/big-fish-trophy-arctic-char-charr-2091386731",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
});

describe("GET /api", () => {
  test("GET: 200 returns object describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.length).not.toBe(0);
        expect(response.body.endPoints).toEqual(endPoints);
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET: 200 returns a status 200, returns the correct number of comments each of the correct shape", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);

        for (comment of response.body.comments) {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        }
      });
  });

  test("GET: 200 returns comments in correct sort order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy(
          response.body.comments.created_at
        );
      });
  });

  test("GET: 200 returns a status 200, returns empty, but not an error when id provied no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(0);
      });
  });

  test("GET: 404 returns error code and message when id is valid but doesnt exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });

  test("GET: 400 returns error code and message when id is not valid", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("GET: 200 should return an array of all correct length containing all the users, where each user object has the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(4);
        expect(response.body).toEqual([
          {
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          },
          {
            username: "icellusedkars",
            name: "sam",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          },
          {
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          },
          {
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          },
        ]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST: 201 accepts an object with username and body, returns the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "testing, testing, 123!",
        username: "butter_bridge",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "testing, testing, 123!",
          article_id: 1,
        });
      });
  });

  test("POST: 201 accepts an object with username and body, ignores additional elemnets on the body and returns the correctly posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "testing, testing, 123!",
        bananas: "banana",
        username: "butter_bridge",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "testing, testing, 123!",
          article_id: 1,
        });
      });
  });

  test("POST: 400 should return Bad Request for missing input fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})

      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("POST: 404 should return Not Found for invalid author field", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "testing, testing, 123!",
        username: "Elusive",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });

  test("POST: 400 should return Bad Request for invalid article id input", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send({
        body: "testing, testing, 123!",
        username: "butter_bridge",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("POST: 404 should return Not Found if valid but not existing article_id", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        body: "testing, testing, 123!",
        username: "butter_bridge",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE: 204 removes a comment by the comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.body.message).toBe(undefined);
        expect(response.body).toEqual({});
      });
  });

  test("DELETE: 404 returns error code and message when id is valid but doesnt exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH: 202 updates the votes on an article by the article_id then returns the updated article with no other properties changed", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5555 })
      .expect(202)
      .then((response) => {
        expect(response.body.updatedArticle[0].votes).toBe(5655);
        expect(response.body.updatedArticle[0].article_id).toBe(1);
        expect(response.body.updatedArticle[0].author).toBe("butter_bridge");
        expect(response.body.updatedArticle[0].title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.updatedArticle[0].body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.updatedArticle[0].topic).toBe("mitch");
        expect(typeof response.body.updatedArticle[0].created_at).toBe(
          "string"
        );
        expect(typeof response.body.updatedArticle[0].article_img_url).toBe(
          "string"
        );
      });
  });

  test("PATCH: 202 should not change any properties of any other articles", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5555 })
      .expect(202)
      .then((response) => {
        expect(response.body.updatedArticle.length).toBe(1);
      });
  });

  test("PATCH: 202 should return 400 when given an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 5555 })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("DELETE: 400 returns an error message if provided with additional input after a vaid comment_id", () => {
    return request(app)
      .delete("/api/comments/1&2")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH: 202 updates the votes on an article by the article_id then returns the updated article with no other properties changed", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5555 })
      .expect(202)
      .then((response) => {
        expect(response.body.updatedArticle[0].votes).toBe(5655);
        expect(response.body.updatedArticle[0].article_id).toBe(1);
        expect(response.body.updatedArticle[0].author).toBe("butter_bridge");
        expect(response.body.updatedArticle[0].title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.updatedArticle[0].body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.updatedArticle[0].topic).toBe("mitch");
        expect(typeof response.body.updatedArticle[0].created_at).toBe(
          "string"
        );
        expect(typeof response.body.updatedArticle[0].article_img_url).toBe(
          "string"
        );
      });
  });

  test("PATCH: 202 should not change any properties of any other articles", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5555 })
      .expect(202)
      .then((response) => {
        expect(response.body.updatedArticle.length).toBe(1);
      });
  });

  test("PATCH: 400 should return 400 when given an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 5555 })

      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("PATCH: 404 should return 404 when given a valid but nonexistent article_id", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 5555 })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });

  test("PATCH: 400 should return 400 when request body has no inc_votes property", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH: 202 updates the votes on a comment by the comment_id then returns the updated comment with no other properties changed", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 500 })
      .expect(202)
      .then((response) => {
        const updatedComment = response.body.updatedComment[0];
        expect(updatedComment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: "butter_bridge",
          votes: 516,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });

  test("PATCH: 404 returns 404 and error message when the comment_id is valid but doesnt exist", () => {
    return request(app)
      .patch("/api/comments/999")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });

  test("PATCH: 400 returns 400 and error message when the comment_id is invalid", () => {
    return request(app)
      .patch(
        "/api/comments/DELETE FROM comments WHERE comment_id = 1 RETURNING *;"
      )
      .send({ inc_votes: 5 })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("PATCH: 400 should return 400 and error message when request body has no inc_votes property", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})

      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("PATCH: 400 should return 400 and error message when request body has an inc_votes property which is not a number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        inc_votes: "DELETE FROM comments WHERE comment_id = 1 RETURNING *;",
      })

      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});
