const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const tokenHeader = req.header("Authorization");
  let token;
  if (tokenHeader) {
    const tokenMatch = tokenHeader.trim().match(/Bearer ([^\s]+)/);
    if (tokenMatch) token = tokenMatch[1];
  }

  if (!token || !tokenHeader)
    return res.status(401).send("Access denied! no token provided");
  console.log("token provided");
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (er) {
    return res.status(400).send("Invalid token");
  }
};
