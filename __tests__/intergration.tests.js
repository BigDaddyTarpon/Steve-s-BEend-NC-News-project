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

describe("/api/topics", () => {
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

describe("non existent endpoint", () => {
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

describe("/api/articles", () => {
  test("GET:200 returns status 200", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("GET:200 returns an arrayof all articles including a comment_count but without body property", () => {
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

describe("/api/articles/:article_id", () => {
  test("GET:200 returns the article with appropriate properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(typeof response.body.articles[0].article_id).toBe("number");
        expect(typeof response.body.articles[0].votes).toBe("number");
        expect(typeof response.body.articles[0].author).toBe("string");
        expect(typeof response.body.articles[0].title).toBe("string");
        expect(typeof response.body.articles[0].body).toBe("string");
        expect(typeof response.body.articles[0].topic).toBe("string");
        expect(typeof response.body.articles[0].created_at).toBe("string");
        expect(typeof response.body.articles[0].article_img_url).toBe("string");
      });
  });
});
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
describe("/api", () => {
  test("GET:200 returns object describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.length).not.toBe(0);
        expect(response.body.endPoints).toEqual(endPoints);
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 returns a status 200, returns the correct number of comments each of the correct shape", () => {
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
  test("GET:200 returns comments in correct sort order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy(
          response.body.comments.created_at
        );
      });
  });
  test("GET:200 returns a status 200, returns empty, but not an error when id provied no comments", () => {
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
describe.only("/api/articles/:article_id", ()=>{
  test("GET: 200 updates the votes on an article by the article_id then returns the updated artice", ()=>{
    return request(app)
      .get("/api/articles/1")
      .send( { inc_votes: 555 })
      .expect(200)
      // .then((response) => {
      //   console.log(response.body, "<<<<<<<in test")
      //   expect(response.body.message).toBe("OK")

      //})
  })
})

