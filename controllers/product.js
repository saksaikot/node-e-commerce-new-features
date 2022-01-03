const { Product, validate } = require("../models/product");
const { _pick } = require("../helper/lodash");
const formidable = require("formidable");
const fs = require("fs");
const create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, parseReq(req, res));
};
function parseReq(req, res, update = false) {
  return async (err, fields, files) => {
    let product, updatedProduct;
    if (update) {
      product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send("Product not found");
      updatedProduct = _pick(fields, [
        "name",
        "description",
        "price",
        "category",
        "quantity",
      ]);
    }
    if (err) return res.status(400).send("something went wrong");
    // const {name,description,price,category,quantity} = fields;
    if (!update) {
      const { error } = validate(fields);
      if (error) return res.status(400).send(error.details[0].message);
      if (!files.photo) return res.status(400).send("Must give an image");
      product = new Product(fields);
    } else {
      Object.assign(product, updatedProduct);
      // console.log("new product", product);
      //product={...product,...updatedProduct}
    }
    if (files.photo) {
      const data = await fs.promises.readFile(files.photo.filepath);
      product.photo = { data, contentType: files.photo.mimetype };

      // await fs.promises.readFile(files.photo.filepath, async (err, data) => {
      //   if (err) return res.status(400).send("Problem in file data");
      //   // console.log(files.photo);

      //   product.photo = { data, contentType: files.photo.mimetype };

      // });
    }
    try {
      const saveResult = await product.save();
      return res.status(update ? 200 : 201).send({
        message: `product ${update ? "updated" : "created"} successfully`,
        data: _pick(saveResult, [
          "_id",
          "name",
          "description",
          "price",
          "category",
          "quantity",
        ]),
      });
    } catch (err) {
      console.log(err.message);
    }
  };
}
// function parseReq
// query parameters
const index = async (req, res) => {
  //test query parameter uri ?order=desc&sortBy=name&limit=10
  console.log(req.query); // accessing query data
  const query = req.query;
  const order = query.order === "desc" ? -1 : 1;
  const sortBy = query.sortBy || "_id";
  const limit = parseInt(query.limit) || 10;
  const products = await Product.find()
    .select({ photo: 0 })
    .populate("category", "name")
    .sort({ [sortBy]: order })
    .limit(limit);
  return res.status(200).send(products);
};
const item = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .select("-photo");
  if (!product) return res.status(404).send("Product not found");
  return res.send(product);
};
const photoById = async (req, res) => {
  const product = await Product.findById(req.params.id).select("photo");
  if (!product) return res.status(404).send("Product not found");
  res.set("Content-Type", product.photo.contentType);
  return res.send(product.photo.data);
};
const store = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, parseReq(req, res, true)); //parseReq(res,update:true)
};
/*
 {
  "order": "desc",
  "sortBy": "price",
  "limit": 6,
  "skip": 0,
  "filter":{
    "range":{
      "price":[10,1000]
    },
    "in":{
      "category":["category-object-id"]
    }
  }
}
*/
const processFilterRange = (range) => {
  const args = {};
  for (let key in range) {
    args[key] = {
      $gte: range[key][0],
      $lte: range[key][1],
    };
  }
  return args;
};
const processFilterIn = (range) => {
  const args = {};
  for (let key in range) {
    args[key] = {
      $in: range[key],
    };
  }
  return args;
};
const filter = async (req, res) => {
  const query = req.body;
  const filter = query.filter;
  const order = query.order === "desc" ? -1 : 1;
  const sortBy = query.sortBy || "_id";
  const limit = parseInt(query.limit) || 10;
  const skip = parseInt(query.skip) || 0;
  let args = {};
  if (filter.range) {
    args = { ...args, ...processFilterRange(filter.range) };
  }
  if (filter.in) {
    args = { ...args, ...processFilterIn(filter.in) };
  }
  console.log(args);
  const products = await Product.find(args)
    .select({ photo: 0 })
    .populate("category", "name")
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);
  return res.status(200).send(products);
};
module.exports = {
  create,
  index,
  item,
  store,
  photoById,
  filter,
};
