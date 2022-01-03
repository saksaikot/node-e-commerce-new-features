require("express-async-errors");
const express = require("express");
const app = express();

require("./middlewares")(app);
require("./middlewares/routes")(app);
app.use(require("./middlewares/errors"));
module.exports = app;
