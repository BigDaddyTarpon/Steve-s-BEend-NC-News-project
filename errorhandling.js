exports.handle404 = (req, res) => {
  res.status(404).send({ message: "Not found" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
    //console.log(res, err, "PSQL ERROR CATCHER")

  if (err === "22P02") {
    console.log(err, "PSQL ERROR CATCHER")
    res.status(400).send({ message: "Bad request" });
  } 
    next(err);
  
};

exports.handleInternalServerError = (err, req, res, next) => {
    console.log(err, "server error catch SHOULDNT SEE THIS")
  res.status(500).send({ message: "Internal Server Error" });
};
