const fs = require("fs");

// Class for DataBase
class DataBase {
  constructor() {
    this.urlsArr = [];
  }

  MakeNewShortenedUrl(url) {
    const newUrlObject = {};
    newUrlObject.creationDate = dateToSqlFormat();
    newUrlObject.redirectCount = 0;
    newUrlObject.originalUrl = url;
    newUrlObject["shorturl-id"] = shortUrlGenerator();
    this.urlsArr.push(newUrlObject);
    fs.writeFile(
      "./urls.json",
      JSON.stringify(this.urlsArr, null, 4),
      (err) => {
        if (err) throw new Error(`message: ${err}`);
      }
    );
  }
}

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
