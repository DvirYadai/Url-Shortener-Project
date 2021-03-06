const request = require("supertest");
const fs = require("fs");
const app = require("../app");
const { initializeUrlsJsonFile } = require("../net-utils/DBClass");

afterAll(() => {
  initializeUrlsJsonFile();
});

describe("POST Route", () => {
  const expectedExistShortenedUrlObject = {
    creationDate: "2021-03-02 17:24:49",
    redirectCount: 2,
    originalUrl: "https://www.google.com",
    "shorturl-id": "fr3qc",
  };
  const expectedNewShortenedUrlObject = {
    creationDate: "2021-03-02 17:24:49",
    redirectCount: 0,
    originalUrl: "https://www.youtube.com/",
    "shorturl-id": "ad34f",
  };
  const newValidUrl = { url: "https://www.youtube.com/" };
  const existingUrl = { url: "https://www.google.com" };
  const newInvalidUrl = { url: "www.youtube.com/" };
  const newDoesNotExistUrl = { url: "https://www.asddfgghj.com/" };
  const invalidUrlError = "Invalid Url!";
  const doesNotExistUrlError = "This url does not exist!";

  it("Should post and return new shortened url object, and check if it was updated in the json file", async () => {
    const response = await request(app).post(`/api/shorturl`).send(newValidUrl);
    expectedNewShortenedUrlObject.creationDate = response.body.creationDate;
    expectedNewShortenedUrlObject["shorturl-id"] = response.body["shorturl-id"];

    let data = fs.readFileSync(`./test.json`);
    data = JSON.parse(data);

    // Is the status code 200
    expect(response.status).toBe(200);

    // Is the body equal expectedNewShortenedUrlObject
    expect(response.body).toEqual(expectedNewShortenedUrlObject);
    expect(data.urlsArr[1]).toEqual(expectedNewShortenedUrlObject);
  });

  it("Should return existing shortened url object if already exist", async () => {
    const response = await request(app).post(`/api/shorturl`).send(existingUrl);

    // Is the status code 200
    expect(response.status).toBe(200);

    // Is the body equal expectedExistShortenedUrlObject
    expect(response.body[0]).toEqual(expectedExistShortenedUrlObject);
  });

  it("Should return an error if original url is invalid", async () => {
    const response = await request(app)
      .post(`/api/shorturl`)
      .send(newInvalidUrl);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal invalidUrlError
    expect(response.text).toEqual(invalidUrlError);
  });

  it("Should return an error if original url is not exist", async () => {
    const response = await request(app)
      .post(`/api/shorturl`)
      .send(newDoesNotExistUrl);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal doesNotExistUrlError
    expect(response.text).toEqual(doesNotExistUrlError);
  });
});

describe("GET Routes to http://localhost/api/shorturl/:shorturlid", () => {
  const invalidShortenedUrlFormatError = "Invalid shortened url format!";
  const doesNotExistShortenedUrlError = "There is no such short url!";

  it("Should redirect to original url when entering http://localhost/api/shorturl/:shorturlid and updating the redirectCount in the json file", async () => {
    const response = await request(app).get(`/api/shorturl/fr3qc`);

    let data = fs.readFileSync(`../test.json`);
    data = JSON.parse(data);

    // Is the status code 302
    expect(response.status).toBe(302);

    // Is the body equal to google address
    expect(response.redirect).toBeTruthy;
    expect(data.urlsArr[0].redirectCount).toEqual(3);
  });

  it("Should return error when entering an invalid shortened url format", async () => {
    const response = await request(app).get(`/api/shorturl/fr3qcw`);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal invalidShortenedUrlFormatError
    expect(response.text).toEqual(invalidShortenedUrlFormatError);
  });

  it("Should return error when entering a shortened url that does not exist", async () => {
    const response = await request(app).get(`/api/shorturl/aaaaa`);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal doesNotExistShortenedUrlError
    expect(response.text).toEqual(doesNotExistShortenedUrlError);
  });
});

describe("GET Routes to http://localhost/api/statistic/:shorturlid", () => {
  const expectedExistShortenedUrlObject = {
    creationDate: "2021-03-02 17:24:49",
    redirectCount: 3,
    originalUrl: "https://www.google.com",
    "shorturl-id": "fr3qc",
  };

  const invalidShortenedUrlFormatError = "Invalid shortened url format!";
  const doesNotExistShortenedUrlError = "There is no such short url!";

  it("Should return existing shortened url object when writing existing shortened url in the statistic route", async () => {
    const response = await request(app).get(`/api/statistic/fr3qc`);

    // Is the status code 200
    expect(response.status).toBe(200);

    // Is the body equal expectedExistShortenedUrlObject
    expect(response.body).toEqual(expectedExistShortenedUrlObject);
  });

  it("Should return error when writing an invalid shortened url format in the statistic route", async () => {
    const response = await request(app).get(`/api/statistic/fr3qcw`);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal invalidShortenedUrlFormatError
    expect(response.text).toEqual(invalidShortenedUrlFormatError);
  });

  it("Should return error when writing a shortened url that does not exist in the statistic route", async () => {
    const response = await request(app).get(`/api/statistic/aaaaa`);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal doesNotExistShortenedUrlError
    expect(response.text).toEqual(doesNotExistShortenedUrlError);
  });
});
