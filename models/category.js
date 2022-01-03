const Joi = require("joi");
const { Schema, model } = require("mongoose");

const categorySchema = Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamp: true }
);

const Category = model("Category", categorySchema);
const validate = (category) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(category);
};

module.exports = {
  Category,
  validate,
};
