const SSLCommerzPayment = require("sslcommerz-lts");
const { _pick } = require("../helper/lodash");
const { CartItem } = require("../models/cartItem");
const { Order } = require("../models/order");
const { Payment } = require("../models/payment");
const { Profile } = require("../models/profile");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;
const siteUrl = (path) => `http://localhost:3000/payment/${path}`;
const setCustomerInfo = (
  data,
  {
    name,
    email,
    address1: add1,
    address2: add2,
    city,
    state,
    postcode,
    country,
    phone,
    fax = phone,
  }
) => {
  const newData = { ...data };
  const info = {
    // name,
    // email,
    add1,
    add2,
    city,
    state,
    postcode,
    country,
    phone,
    fax,
  };
  // console.log(info);
  for (const key in info) newData[`cus_${key}`] = info[key];
  return newData;
};
const setShippingInfo = (
  data,
  { name, address1: add1, address2: add2, city, state, postcode, country }
) => {
  const newData = { ...data };
  const info = {
    add1,
    add2,
    city,
    state,
    postcode,
    country,
  };
  for (const key in info) newData[`ship_${key}`] = info[key];
  return newData;
};
const setItemInfo = (
  data,
  {
    totalAmount: total_amount,
    numOfItem: num_of_item,
    currency = "BDT",
    tranId: tran_id,
    productName: product_name,
    productCategory: product_category,
    productProfile: product_profile,
  }
) => {
  return {
    ...data,
    total_amount,
    num_of_item,
    currency,
    tran_id,
    product_name,
    product_category,
    product_profile,
  };
};
const paymentInit = async (req, res) => {
  const userId = req.user._id;
  const cartItems = await CartItem.find({ user: userId });
  const profile = await Profile.findOne({ user: userId });
  const address = _pick(profile, [
    "phone",
    "address1",
    "address2",
    "city",
    "state",
    "postcode",
    "country",
  ]);
  const transactionId =
    "_" + Math.random().toString(36).substr(2, 9) + new Date().getTime();
  // profile have address1,address2,city,state,postcode,country,phone
  // console.log(profile);
  const [totalAmount, numOfItem] = cartItems.reduce(
    (pre, cur) => [pre[0] + cur.count * cur.price, pre[1] + cur.count],
    [0, 0]
  );

  let data = {
    success_url: siteUrl("success"),
    fail_url: siteUrl("fail"),
    cancel_url: siteUrl("cancel"),
    ipn_url: "https://bohubrihi-ecom-back.herokuapp.com/api/payment/ipn",
    shipping_method: "Courier",
    cus_name: req.user.name,
    cus_email: req.user.email,
    ship_name: "shipping address",
  };
  // console.log({ ...profile, name: req.user.name, email: req.user.email });
  data = setCustomerInfo(data, address);
  data = setShippingInfo(data, address);
  data = setItemInfo(data, {
    totalAmount,
    numOfItem,
    tranId: transactionId,
    productName: "Multi",
    productCategory: "Multi",
    productProfile: "Multi",
  });

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz
    .init(data)
    .then(async (apiResponse) => {
      // return res.status(200).send(apiResponse, data);
      // Redirect the user to payment gateway

      if (apiResponse.status === "SUCCESS") {
        const orderData = {
          cartItems,
          address,
          transactionId,
          userId,
          sessionKey: apiResponse.sessionkey,
        };
        // console.log(orderData);
        // return res.send("1");
        const order = new Order(orderData);
        await order.save();
        // try {
        //   await order.save();
        // } catch (err) {
        //   console.error(err.message);
        // }
        return res.send({
          status: "SUCCESS",
          redirect: apiResponse.GatewayPageURL,
        });
      }

      // else (apiResponse.status === "FAILED")
      return res.status(200).send({ status: "FAILED" });

      // let GatewayPageURL = apiResponse.GatewayPageURL;
      // res.redirect(GatewayPageURL);
      // console.log("Redirecting to: ", GatewayPageURL);
    })
    .catch((error) => {
      const errorMessage = error.response ? error.response : error.message;
      console.log(errorMessage);
      return res.status(500).send(errorMessage);
    });
};

const ipn = async (req, res) => {
  const payment = new Payment(req.body);
  if (payment.status === "VALID") {
    const order = await Order.updateOne(
      { transactionId: payment.tran_id },
      { status: "Complete" }
    );

    //order complete now remove cart items
    await CartItem.deleteMany(order.cartItems);
  } else {
    await Order.deleteOne({ transactionId: payment.tran_id });
  }
  await payment.save();
  return res.send("ok");
};
module.exports = { paymentInit, ipn };
