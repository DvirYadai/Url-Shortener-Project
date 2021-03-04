const express = require("express");
const router = express.Router();
const { dataBase } = require("../DBClass");
const { isShortenedUrlInFormat, isUrlValid } = require("../url-validation");

router.get("/:shorturlid", (req, res) => {
  const { shorturlid } = req.params;
  try {
    isShortenedUrlInFormat(shorturlid);
    const specificUrl = dataBase.GetSpecificUrl(shorturlid);
    return res.send(specificUrl);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
