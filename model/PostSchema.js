let mongoose = require("mongoose");

let postSchema = mongoose.Schema({
  title: String,
  summary: String,
  category: String,
  content: String,
  cover: String,
  author:String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
}, {
    timestamps:true
});

let post = mongoose.model("post", postSchema);

module.exports = post
