var Post = require('../models/post').post;
      
exports.index = function(req, res) {
  Post.find({}, function(err, docs) {
    if(!err) {
      res.json(200, { posts: docs });
    } else {
      res.json(500, { message: err });
    }
  });
}