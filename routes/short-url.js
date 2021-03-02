const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("this is a /api/shorturl/ route");
});

module.exports = router;
