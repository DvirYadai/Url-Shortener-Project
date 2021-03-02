const express = require("express");
const router = express.Router();

router.get("/:shorturl-id", (req, res) => {
  res.send("this is a api/statistic/:shorturl-id route");
});

module.exports = router;
