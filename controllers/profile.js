const { Profile } = require("../models/profile");

const get = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  return res.send(profile);
};
const create = async (req, res) => {
  const { phone, address1, address2, city, postcode, country, state } =
    req.body;
  let profile = await Profile.findOne({ user: req.user._id });
  if (profile) {
    // if (profile.user !== req.user._id)
    //   return res.status(400).send("Profile not Found");
    Object.assign(profile, req.body);
    // profile.update(req.body);

    console.log(profile);
  } else profile = new Profile(req.body);

  profile.user = req.user._id;
  const saveResult = await profile.save();

  return res.status(200).send({
    message: "created successfully",
    data: saveResult,
  });
};
const update = async (req, res) => {};
const remove = async (req, res) => {};

module.exports = {
  get,
  create,
  update,
  remove,
};
