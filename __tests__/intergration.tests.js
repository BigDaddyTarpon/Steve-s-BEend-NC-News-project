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
