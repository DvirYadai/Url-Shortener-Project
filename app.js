require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const shortUrl = require("./routes/short-url");
const statistic = require("./routes/statistic");

app.use(cors());
app.use(bodyParser.json());
app.use("/api/shorturl", shortUrl);
app.use("/api/statistic", statistic);

app.use("/public", express.static(`./public`));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

module.exports = app;
