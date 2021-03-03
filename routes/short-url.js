const express = require("express");
const router = express.Router();
const dataBase = require("../DBClass");

router.get("/", (req, res) => {
  res.send(dataBase.MakeNewShortenedUrl("https://www.google.com"));
});

router.get("/:shorturlid", (req, res) => {
  const { shorturlid } = req.params;
  const { originalUrl } = dataBase.GetSpecificUrl(shorturlid);
  try {
    dataBase.updateUrlredirectCount(shorturlid);
    res.redirect(302, originalUrl);
  } catch (error) {
    console.log(error);
    res.send();
  }
});

module.exports = router;
