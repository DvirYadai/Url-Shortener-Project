const express = require("express");
const router = express.Router();
const dataBase = require("../DBClass");

router.get("/", (req, res) => {
  res.send(dataBase.MakeNewShortenedUrl("https://www.google.com"));
});

module.exports = router;
