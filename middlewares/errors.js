module.exports = (err, req, res, next) => {
  return res.status(500).send("Im broke and here is the error " + err.message);
};
