const { Schema, model } = require("mongoose");

const profileSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "User",
  },
  phone: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  postcode: String,
  country: String,
});

/*
{"phone":"017892211212",
"address1":"sample address n/s",
"city":"Dhaka",
"state":"Dhaka",
"postcode":"1207",
"country":"Bangladesh"

}

*/
const Profile = model("Profile", profileSchema);
module.exports = { Profile, profileSchema };
