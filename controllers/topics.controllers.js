const { selectTopics, selectArticlesById } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })

    .catch((err) => {
      console.log(err, "<--err catch in controller line 10");
      next(err);
    });

};

exports.getArticlesById = (req, res, next) =>{
const {article_id} = req.params;
selectArticlesById(article_id)
.then((articles)=>{
  res.status(200).send({articles})
})

};
