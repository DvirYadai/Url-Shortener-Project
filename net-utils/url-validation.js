const isUrl = require("is-valid-http-url");
const fetch = require("node-fetch");

function isShortenedUrlInFormat(url) {
  if (!/^[a-z0-9]{5}$/.test(url)) {
    throw "Invalid shortened url format!";
  }
}

async function isUrlValid(url) {
  if (!isUrl(url)) {
    throw "Invalid Url!";
  }
  const isUrlRealTrueOrFalse = await isUrlReal(url);
  if (!isUrlRealTrueOrFalse) {
    throw "This url does not exist!";
  }
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

module.exports = { isShortenedUrlInFormat, isUrlValid };
