const Joi = require("joi");
const { Schema, model } = require("mongoose");
const reviewSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    description: {
      type: Number,
      default: null,
      enum: [1, 2, 3, 4, 5],
    },
    quality: {
      type: Number,
      default: null,
      enum: [1, 2, 3, 4, 5],
    },
    service: {
      type: Number,
      default: null,
      enum: [1, 2, 3, 4, 5],
    },
    feedback: String,
  },
  { timestamp: true }
);

const Review = model("Review", reviewSchema);
module.exports = { Review, reviewSchema };
