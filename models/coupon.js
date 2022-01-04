// const Joi = require("joi");
const { Schema, model } = require("mongoose");

const couponSchema = Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamp: true }
);

const Coupon = model("Coupon", couponSchema);

module.exports = {
  Coupon,
};
