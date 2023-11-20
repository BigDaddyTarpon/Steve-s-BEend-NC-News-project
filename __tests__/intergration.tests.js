const request = require("supertest");
const app  = require("../app");
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
      return request(app)
      .get("/api/topics")
      .expect(200);
    });
});