const express = require("express");
const router = express.Router();
const dataBase = require("../DBClass");

router.post("/", async (req, res) => {
  const url = req.body.url;
  try {
    const urlObj = await dataBase.MakeNewShortenedUrl(url);
    return res.send(urlObj);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/:shorturlid", (req, res) => {
  const { shorturlid } = req.params;
  const { originalUrl } = dataBase.GetSpecificUrl(shorturlid);
  try {
    dataBase.updateUrlredirectCount(shorturlid);
    res.redirect(302, originalUrl);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
