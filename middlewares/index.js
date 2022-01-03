const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    app.use(function (req, res, next) {
      setTimeout(next, 0);
    });
  }
};
