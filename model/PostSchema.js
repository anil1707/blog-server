let mongoose = require("mongoose");

let postSchema = mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  author:String
}, {
    timestamps:true
});

let post = mongoose.model("post", postSchema);

module.exports = post
