const { Category, validate } = require("../models/category");
const { _pick } = require("../helper/lodash");
const create = async function (req, res) {
  const { name } = req.body;
  const { error } = validate({ name });
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category({ name });

  const save = await category.save();
  return res.status(201).send({
    message: "Category created successfully",
    data: _pick(save, ["_id", "name"]),
  });
};

const index = async function (req, res) {
  const categories = await Category.find().sort({ name: 1 });
  return res.status(200).send(categories);
};

module.exports = {
  create,
  index,
};
