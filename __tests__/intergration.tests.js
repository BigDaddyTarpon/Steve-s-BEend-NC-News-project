const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

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

describe.only("/api/articles", () => {
  test("GET:200 returns status 200", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("GET:200 returns status all articles without body property", () => {
    return request(app)
      .get("/api/articles")

      .then((response) => {
        response.body.articles.rows.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.body).toBe("undefined");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
        });
      });
  });
});
