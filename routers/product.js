const {
  create,
  index,
  item,
  store,
  photoById,
  filter,
  createReview,
} = require("../controllers/product");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();

router.route("/").post([authorize, admin], create).get(index);
router.route("/:id").put([authorize, admin], store).get(item);
router.route("/review/:id").post([authorize], createReview);
router.route("/photo/:id").get(photoById);

router.route("/filter/").post(filter);
module.exports = router;
