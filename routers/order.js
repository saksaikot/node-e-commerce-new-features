const { index } = require("../controllers/order");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();

router.route("/").get([authorize], index);

module.exports = router;
