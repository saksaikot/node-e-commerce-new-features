const { Schema, model } = require("mongoose");
const { cartItemSchema } = require("./cartItem");

const orderSchema = Schema(
  {
    cartItems: [cartItemSchema],
    transactionId: {
      type: String,
      unique: true,
    },
    address: {
      phone: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      postcode: String,
      country: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Complete", "Canceled"],
      default: "Pending",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sessionKey: String,
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = { Order };
