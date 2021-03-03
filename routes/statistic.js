const express = require("express");
const router = express.Router();
const dataBase = require("../DBClass");

router.get("/", (req, res) => {
  res.send("this is a api/statistic/:shorturl-id route");
});

router.get(`/:shorturlid`, (req, res) => {
  const { shorturlid } = req.params;
  res.send(dataBase.GetSpecificUrl(shorturlid));
});

module.exports = router;
