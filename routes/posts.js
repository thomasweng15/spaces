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

exports.show = function(req, res) {
  var id = req.params.id; // The id of the post the user wants to look up.
  Post.findById(id, function(err, doc) {
    if(!err && doc) {
      res.json(200, doc);
    } else if(err) {
      res.json(500, { message: "Error loading post." + err});
    } else {
      res.json(404, { message: "Post not found."});
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

exports.update = function(req, res) {
  var id = req.body.id;
  var post_name = req.body.post_name;
  var post_description = req.body.post_description;
      
  Post.findById(id, function(err, doc) {
      if(!err && doc) {
        doc.name = post_name;
        doc.description = post_description;
        doc.save(function(err) {
          if(!err) {
            res.json(200, {message: "post updated: " + post_name});
          } else {
            res.json(500, {message: "Could not update post. " + err});
          }
        });
      } else if(!err) {
        res.json(404, { message: "Could not find post."});
      } else {
        res.json(500, { message: "Could not update post. " + err});
      }
    });
}

exports.delete = function(req, res) {
  var id = req.body.id;
  Post.findById(id, function(err, doc) {
    if(!err && doc) {
      doc.remove();
      res.json(200, { message: "Post removed."});
    } else if(!err) {
      res.json(404, { message: "Could not find post."});
    } else {
      res.json(403, {message: "Could not delete post. " + err});
    }
  });
}