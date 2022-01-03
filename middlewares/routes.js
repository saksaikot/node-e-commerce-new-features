module.exports = (app) => {
  app.use("/api/user/", require("../routers/users"));
  app.use("/api/category", require("../routers/category"));
  app.use("/api/product", require("../routers/product"));
  app.use("/api/cart", require("../routers/cartItem"));
  app.use("/api/profile", require("../routers/profile"));
  app.use("/api/payment", require("../routers/payment"));
  app.use("/*", (req, res) => res.send("running.."));
};
