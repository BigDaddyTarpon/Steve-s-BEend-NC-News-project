const { selectTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {selectTopics()
    .then((topics) => {
      console.log("in controller line 5")
      res.status(200).send({ topics });
    })
    
    .catch((err)=>{console.log(err, "<--err catch in control") 
      next(err)})
  }