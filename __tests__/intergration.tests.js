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
