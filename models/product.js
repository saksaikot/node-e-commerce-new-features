const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { Review, reviewSchema } = require("./review");
const faqSchema = Schema({
  userId: Schema.Types.ObjectId,

  question: String,
  answers: [
    {
      answer: String,
      userId: Schema.Types.ObjectId,
    },
  ],
});

const productSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    overallRating: Number,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    faqs: [faqSchema],
  },
  { timestamp: true }
);

const Product = model("Product", productSchema);
const validate = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(2000).required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    category: Joi.string().required(),
  });
  return schema.validate(product);
};

module.exports = {
  Product,
  validate,
};
