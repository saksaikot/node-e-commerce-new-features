const { create, index, store } = require("../controllers/coupon");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();

router
  .route("/")
  .post([authorize, admin], create)
  .get([authorize, admin], index);
router.route("/:id").put([authorize, admin], store);

module.exports = router;
