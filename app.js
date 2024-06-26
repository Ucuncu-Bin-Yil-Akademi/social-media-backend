// ? Main Modules
require("dotenv").config();
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const http = require("http");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");

const cors = require("./utils/cors");
const rateLimit = require("./utils/rate-limit");

// ? Express application.
const app = express();

// ? Create a server using http module for socket

const server = http.createServer(app);

mongoose.connect(process.env.MongoDBURI, {
  useNewUrlParser: true,
});

app.use(cors);
app.set("view engine", "ejs"); // ? Template engine tipi.

app.use((req, res, next) => {
  res.locals.errors = [];
  next();
});

app.use(rateLimit);
app.use(helmet(require("./data/helmet.json")));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes"));

app.use(function (req, res, next) {
  next(createError(404, "Not Found " + req.originalUrl));
});

server.listen(3001, () => console.log("Server is running"));

module.exports = app;
