const { Schema, model } = require("mongoose");

const cartItemSchema = Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: Number,
    count: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purchased: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CartItem = model("CartItem", cartItemSchema);
module.exports = {
  cartItemSchema,
  CartItem,
};
