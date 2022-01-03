const { create, index } = require("../controllers/category");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();

router.route("/").post([authorize, admin], create).get(index);

module.exports = router;
