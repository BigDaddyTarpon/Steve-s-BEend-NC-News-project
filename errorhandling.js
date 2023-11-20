exports.handle404 = (req, res) => {
  res.status(404).send({ message: "Not found" });
};

exports.handleInternalServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
