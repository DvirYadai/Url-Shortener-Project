const express = require("express");
const router = express.Router();
const { dataBase } = require("../net-utils/DBClass");
const {
  isShortenedUrlInFormat,
  isUrlValid,
} = require("../net-utils/url-validation");

router.post("/", async (req, res) => {
  const url = req.body.url;
  const customShortUrl = req.body.customShortUrl;
  try {
    await isUrlValid(url);
    const urlObj = await dataBase.MakeNewShortenedUrl(url, customShortUrl);
    return res.send(urlObj);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/:shorturlid", (req, res) => {
  const { shorturlid } = req.params;
  try {
    isShortenedUrlInFormat(shorturlid);
    const { originalUrl } = dataBase.GetSpecificUrl(shorturlid);
    dataBase.updateUrlredirectCount(shorturlid);
    return res.redirect(302, originalUrl);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
