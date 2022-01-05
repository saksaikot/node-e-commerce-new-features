const { Order } = require("../models/order");
const { _pick } = require("../helper/lodash");

const index = async function (req, res) {
  const order = await Order.find({ userId: req.user._id })
    .populate({ path: "cartItems.product", select: "name" })
    .select({
      sessionKey: 0,
    });
  return res.status(200).send(order);
};

module.exports = {
  index,
};
