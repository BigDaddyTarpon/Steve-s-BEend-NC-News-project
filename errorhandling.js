exports.handle404 = (req, res) => {
  res.status(404).send({ message: "Not found" });
};

exports.handlePSQLError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  }
  next(err);
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.message && err.status) {
    res.status(err.status).send(err);
  }
  next(err);
};

exports.handleInternalServerError = (err, req, res, next) => {
  res.status(500).send(err);
};
