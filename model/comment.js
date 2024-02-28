const mongoose = require("mongoose");
const post = require("./PostSchema");

const commentsSchema = new mongoose.Schema(
  {
    comments: { type: String },
    user: { type: String, required: true }, // Change 'require' to 'required'
    postId: { type: mongoose.Schema.Types.ObjectId, ref: post },
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("comment", commentsSchema);

module.exports = commentModel;
