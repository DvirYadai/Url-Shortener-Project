const fs = require("fs");
const axios = require("axios").default;

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
        console.log(res.data.record);
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

  async MakeNewShortenedUrl(url) {
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
    newUrlObject["shorturl-id"] = shortUrlGenerator();
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

  GetAllUrls() {
    return this.urlsObj;
  }

  GetSpecificUrl(shortenedUrl) {
    const isExistUrl = this.urlsObj.urlsArr.filter(
      (obj) => obj["shorturl-id"] === shortenedUrl
    );
    if (isExistUrl.length > 0) {
      return isExistUrl[0];
    } else throw `There is no such shortened url!`;
  }

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

function dateToSqlFormat() {
  let timeCreation = new Date();
  timeCreation =
    timeCreation.toISOString().split("T")[0] +
    " " +
    timeCreation.toTimeString().split(" ")[0];
  return timeCreation;
}

function shortUrlGenerator() {
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
  let string = "";
  for (let i = 0; i < 5; i++) {
    string += charArr[Math.floor(Math.random() * 35)];
  }
  return string;
}

// the methods below is only for tests!
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
