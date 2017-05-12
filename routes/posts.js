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

// TODO refactor with upsert
exports.create = function(req, res) {
      
  var post_name = req.body.post_name; // Name of post.
  var description = req.body.post_description; // Description of the post
      
Post.findOne({ name: { $regex: new RegExp(post_name, "i") } },
function(err, doc) { // Using RegEx - search is case insensitive
    if(!err && !doc) {
      
      var newPost = new Post();
      
      newPost.name = post_name;
      newPost.description = description;
      
      newPost.save(function(err) {
      
        if(!err) {
          res.json(201, {message: "Post created with name: " + newPost.name });
        } else {
          res.json(500, {message: "Could not create post.Error: " + err});
        }
      
      });
      
    } else if(!err) {
      
      // User is trying to create a post with a name that
      // already exists.
      res.json(403, {message: "Post with that name already exists, please update instead of create or create a new post with a different name."});
      
    } else {
      res.json(500, { message: err});
    }
  });
      
}