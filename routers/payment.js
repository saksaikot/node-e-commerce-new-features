const { paymentInit, ipn } = require("../controllers/payment");
const authorize = require("../middlewares/authorize");
const router = require("express").Router();

router.route("/init").get(authorize, paymentInit);

router.route("/ipn").post(ipn);

module.exports = router;
