const { get, create, update, remove } = require("../controllers/cartItem");

const router = require("express").Router();
const authorize = require("../middlewares/authorize");
router.route("/").get(authorize, get).post(authorize, create);

router.route("/:id").put(authorize, update).delete(authorize, remove);

module.exports = router;
