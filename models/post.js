var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
      
var postSchema = new Schema({
    name : { type: String, required: true, trim: true, index: { unique: true } }
  , description : { type: String, required: true }
  , date_created : { type: Date, required: true, default: Date.now }
});
      
var post = mongoose.model('post', postSchema);
      
module.exports = {
  post: post
};