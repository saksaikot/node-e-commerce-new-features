const { Coupon } = require("../models/coupon");
const { _pick } = require("../helper/lodash");
const create = async function (req, res) {
  const { code, discount } = req.body;
  console.log(req.body);
  const coupon = await Coupon.findOne({ code });
  if (coupon) {
    return res.send({ message: "Coupon code already exist" });
  } else {
    const newCoupon = new Coupon({ code, discount });
    const result = await newCoupon.save();
    return res.status(201).send({
      message: "Coupon created successfully",
      data: _pick(result, ["_id", "code", "discount"]),
    });
  }
};

const index = async function (req, res) {
  const coupon = await Coupon.find().sort({ code: 1 });
  return res.status(200).send(coupon);
};
const store = async (req, res) => {
  const id = req.params.id;
  const coupon = await Coupon.findById(id);
  if (!coupon) return res.status(400).send({ message: "Coupon not found" });
  const newCoupon = { code: req.body.code, discount: req.body.discount };
  Object.assign(coupon, newCoupon);
  const result = await coupon.save();

  return res.send(result);
};
module.exports = {
  create,
  index,
  store,
};
