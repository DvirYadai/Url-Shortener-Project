const fs = require("fs");
const axios = require("axios").default;
const {
  isShortenedUrlInFormat,
  isUrlValid,
} = require("../net-utils/url-validation");

let address;
if (process.env.NODE_ENV === "test") {
  address = "test";
} else {
  address = "604203ce81087a6a8b96b0e8";
}

let path;
if (process.env.NODE_ENV === "test") {
  path = "test";
} else {
  path = "urls";
}

// Class for DataBase
class DataBase {
  constructor() {
    try {
      axios({
        method: "get",
        url: `https://api.jsonbin.io/v3/b/${address}/latest`,
      }).then((res) => {
        this.urlsObj = res.data.record;
        fs.writeFile(
          `./urls.json`,
          JSON.stringify(this.urlsObj, null, 4),
          (err) => {
            if (err) throw new Error(`message: ${err}`);
          }
        );
      });
      if (process.env.NODE_ENV === "test") {
        try {
          const data = fs.readFileSync(`./test.json`);
          this.urlsObj = JSON.parse(data);
        } catch (error) {
          throw new Error(`message: ${error}`);
        }
      }
    } catch (error) {
      throw new Error(`message: ${error}`);
    }
  }

  // Method that make new short url
  async MakeNewShortenedUrl(url, customShortUrl) {
    const isExistUrl = this.urlsObj.urlsArr.filter(
      (obj) => obj.originalUrl === url
    );
    if (isExistUrl.length > 0) {
      return isExistUrl;
    }
    const newUrlObject = {};
    newUrlObject.creationDate = dateToSqlFormat();
    newUrlObject.redirectCount = 0;
    newUrlObject.originalUrl = url;
    try {
      newUrlObject["shorturl-id"] = shortUrlGenerator(customShortUrl);
    } catch (error) {
      throw error;
    }
    this.urlsObj.urlsArr.push(newUrlObject);
    try {
      axios.put(`https://api.jsonbin.io/v3/b/${address}`, this.urlsObj);
    } catch (error) {
      throw error;
    }
    fs.writeFile(
      `./${path}.json`,
      JSON.stringify(this.urlsObj, null, 4),
      (err) => {
        if (err) throw new Error(`message: ${err}`);
      }
    );
    return newUrlObject;
  }

  // Method that return all shortened urls objects
  GetAllUrls() {
    return this.urlsObj;
  }

  // Method that return specific shortened url object.
  GetSpecificUrl(shortenedUrl) {
    const isExistUrl = this.urlsObj.urlsArr.filter(
      (obj) => obj["shorturl-id"] === shortenedUrl
    );
    if (isExistUrl.length > 0) {
      return isExistUrl[0];
    } else throw `There is no such short url!`;
  }

  // Method that update the redirect count every time user enter a website throw shortened url.
  updateUrlredirectCount(shortenedUrl) {
    const index = this.urlsObj.urlsArr.findIndex(
      (obj) => obj["shorturl-id"] === shortenedUrl
    );
    this.urlsObj.urlsArr[index].redirectCount++;
    try {
      axios.put(`https://api.jsonbin.io/v3/b/${address}`, this.urlsObj);
    } catch (error) {
      throw error;
    }
    fs.writeFile(
      `./${path}.json`,
      JSON.stringify(this.urlsObj, null, 4),
      (err) => {
        if (err) throw new Error(`message: ${err}`);
      }
    );
  }
}

const dataBase = new DataBase();

// Function that turn date to SQL format.
function dateToSqlFormat() {
  let timeCreation = new Date();
  timeCreation =
    timeCreation.toISOString().split("T")[0] +
    " " +
    timeCreation.toTimeString().split(" ")[0];
  return timeCreation;
}

// Function that generate new short url.
function shortUrlGenerator(customShortUrl) {
  const charArr = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  if (customShortUrl) {
    try {
      isShortenedUrlInFormat(customShortUrl);
    } catch (error) {
      throw error;
    }
    const customShortUrlCheck = dataBase.urlsObj.urlsArr.filter(
      (obj) => obj["shorturl-id"] === customShortUrl
    );
    if (customShortUrlCheck.length > 0) {
      throw "Short url is already in use!";
    } else return customShortUrl;
  }
  let string = "";
  for (let i = 0; i < 5; i++) {
    string += charArr[Math.floor(Math.random() * 35)];
  }
  let stringCheck = dataBase.urlsObj.urlsArr.filter((obj) => {
    obj["shorturl-id"] === string;
  });
  while (stringCheck.length > 0) {
    string = "";
    for (let i = 0; i < 5; i++) {
      string += charArr[Math.floor(Math.random() * 35)];
    }
    stringCheck = dataBase.urlsObj.urlsArr.filter((obj) => {
      obj["shorturl-id"] === string;
    });
  }
  return string;
}

// the function below is only for tests!
function initializeUrlsJsonFile() {
  dataBase.urlsObj = {
    urlsArr: [
      {
        creationDate: "2021-03-02 17:24:49",
        redirectCount: 2,
        originalUrl: "https://www.google.com",
        "shorturl-id": "fr3qc",
      },
    ],
  };
  fs.writeFile(
    `./test.json`,
    JSON.stringify(dataBase.urlsObj, null, 4),
    (err) => {
      if (err) throw new Error(`message: ${err}`);
    }
  );
}

module.exports = { dataBase, initializeUrlsJsonFile };
