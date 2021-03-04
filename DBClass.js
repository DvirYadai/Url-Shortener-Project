const fs = require("fs");
const isUrl = require("is-valid-http-url");
const fetch = require("node-fetch");

// Class for DataBase
class DataBase {
  constructor() {
    fs.readFile("./urls.json", (err, data) => {
      if (err) {
        throw new Error(`message: ${err}`);
      } else {
        this.urlsObj = JSON.parse(data);
      }
    });
  }

  async MakeNewShortenedUrl(url) {
    if (!isUrl(url)) {
      throw "Invalid Url!";
    }
    const isUrlRealTrueOrFalse = await isUrlReal(url);
    if (!isUrlRealVar) {
      throw "This url does not exist!";
    }
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
    fs.writeFile(
      "./urls.json",
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
    } else throw new Error(`message: There is no such shortened url!`);
  }

  updateUrlredirectCount(shortenedUrl) {
    const index = this.urlsObj.urlsArr.findIndex(
      (obj) => obj["shorturl-id"] === shortenedUrl
    );
    this.urlsObj.urlsArr[index].redirectCount++;
    fs.writeFile(
      "./urls.json",
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

async function isUrlReal(url) {
  return await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return true;
      }
    })
    .catch(() => {
      return false;
    });
}

module.exports = dataBase;
