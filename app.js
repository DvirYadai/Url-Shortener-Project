require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const shortUrl = require("./routes/short-url");
const statistic = require("./routes/statistic");

app.use(cors());

app.use("/api/shorturl/", shortUrl);
app.use("/api/statistic", statistic);

app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

module.exports = app;
