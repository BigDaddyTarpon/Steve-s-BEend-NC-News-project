exports.handle404 = (req, res) => {
  res.status(404).send({ message: "Not found" });
};

exports.handlePSQLError = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Not Found" });
  } else {
    next(err);
  }
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.message && err.status) {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
};

exports.handleInternalServerError = (err, req, res, next) => {
  console.log(err, "err in 500");
  res.status(500).send(err);
};
