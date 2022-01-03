const { CartItem } = require("../models/cartItem");
const { _pick, _unpick } = require("../helper/lodash");
const get = async (req, res) => {
  const cartItems = await CartItem.find({ user: req.user._id, deleted: false })
    .populate("user", "name")
    .populate("product", "name");
  return res.send({
    message: "success",
    data: cartItems,
  });
};
const create = async (req, res) => {
  const user = req.user._id;
  const { price, product } = req.body;
  const oldCartItem = await CartItem.findOne({ user, product });
  if (oldCartItem) return res.status(400).send("Cart Item already exist");

  const cartItem = new CartItem({ price, product, user });

  const saveResult = await cartItem.save();
  res.status(201).send({
    message: "Cart created successfully",
    data: _unpick(saveResult, ["deleted"]),
  });
};
const update = async (req, res) => {
  const { count } = req.body;
  const user = req.user._id;
  const cartItem = await CartItem.findOne({ user, _id: req.params.id });
  if (!cartItem) return res.status(404).send("Cart item not found");
  cartItem.count = count;
  const saveResult = await cartItem.save();
  return res.send({
    message: "Updated successfully",
    data: saveResult,
  });
};
const remove = async (req, res) => {
  const { count } = req.body;
  const user = req.user._id;
  const cartItem = await CartItem.findOne({
    user,
    _id: req.params.id,
    deleted: false,
  });
  if (!cartItem) return res.status(404).send("Cart item not found");
  cartItem.deleted = true;
  const saveResult = await cartItem.save();
  return res.send({
    message: "Deleted successfully",
    data: saveResult,
  });
};

module.exports = { get, create, update, remove };
