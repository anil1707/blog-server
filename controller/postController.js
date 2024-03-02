const post = require("../model/PostSchema");
const user = require("../model/userSchema");
let jwt = require("jsonwebtoken");
let JWT_SECRET_KEY = "ANILKUMARYADAV";
let cloudinary = require("../cloudinaryConfig");
// const categoryModel = require("../model/Category");
const commentModel = require("../model/comment");

const handleUpload = (file) => {
  return new Promise((resolve, reject) => {
    const res = cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    if (res) {
      resolve(res);
    } else {
      reject(res);
    }
  });
};

const uploadPhotoController = (req, res) => {
  const b64 = Buffer.from(req.file?.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  try {
    handleUpload(dataURI).then((cldres) => {
      if (cldres) {
        res.send({ url: cldres.secure_url });
      } else {
        res.status(400).json({ message: "Something went wrong" });
      }
    });
  } catch (error) {
    console.log("Upload photo page error", error);
  }
};
const createPostController = async (req, res) => {
  let userInfo = req.userInfo;
  try {
    if (!userInfo) {
      res.status(401).json({ message: "Unauthorized access!" });
    }
    let data = {
      title: req.body.title,
      summary: req.body.summary,
      category: req.body.category,
      content: req.body.content,
      cover: req.body.files,
      author: userInfo.email,
    };
    const collection = await post(data);
    let result = await collection.save();
    res.send({ message: "Post created successfully", post: result });
  } catch (error) {
    console.log(error);
  }
};

const getAllPostController = async (req, res) => {
  try {
    let posts = await post.find();
    res.send({ posts });
  } catch (error) {
    res.send({ Error: error });
  }
};

const getAllPostByUserController = async (req, res) => {
  let { email } = req.params;
  let allPost = await post.find({ author: email });
  res.send({ posts: allPost });
};

const viewOnePostController = async (req, res) => {
  try {
    let data = await post.findById(req.params.id);
    const comments = await commentModel.find({ postId: req.params.id });
    res.send({ data, comments });
  } catch (error) {
    res.send({ Error: error });
  }
};

const editPostController = async (req, res) => {
  let userInfo = req.userInfo;
  if (!userInfo) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  let postDoc = await post.findById(req.params.id);
  if (userInfo.email !== postDoc.author) {
    return res.status(400).json({ message: "invalid author" });
  }
  await post.updateOne(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        summary: req.body.summary,
        category: req.body.category,
        content: req.body.content,
        cover: req.body.files,
      },
    }
  );
  res.send({ message: "Updated successfully!" });
  
};

const deletePostController = async (req, res) => {
  try {
    let userInfo = req.userInfo;
    if (!userInfo) {
      return res.status(401).json({ message: "Invalid access" });
    }

    let postDoc = await post.findById(req.params.id);
    if (postDoc.author !== userInfo.email) {
      return res.status(400).send({ message: "Invalid access" });
    }
    let data = await post.deleteOne({ _id: req.params.id });
    if (data?.acknowledged === true) {
      res.send({ message: "Deleted Succussfully!" });
    } else {
      res.send({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};

const addCommentController = async (req, res) => {

  // userInfo is set from auth middleware
  const info = req.userInfo;
  if (info === undefined) {
    res.send({ message: "You are not logged in, login first" });
  }
  if (info?.email !== req.body.email) {
    return res.status(400).json({ message: "invalid author" });
  }
  if (info) {
    const collection = await commentModel({
      comments: req.body.comment,
      user: req.body.email,
      postId: req.body.postId,
    });
    const data = await collection.save();
    res.send({ message: "saved successfully" });
  }
};

const getCommentController = async (req, res) => {
  const id = req.params.id;
  const comments = await commentModel.find({ postId: req.params.id });
  res.send({ comments });
};

const likeController = async (req, res) => {
  const { id } = req.params;
  const { email, isLike } = req.query;
  const userInfo = req.userInfo;
  if (userInfo?.email !== email) {
    return res
      .status(401)
      .json({ message: "Invalid access, Please login first" });
  }

  const userDoc = await user.findOne({ email });
  const postDoc = await post.findById(id);

  if (!postDoc.likes.includes(userDoc._id)) {
    const updatedData = await post.updateOne(
      { _id: id },
      {
        $push: {
          likes: userDoc._id,
        },
      },
      { new: true }
    );
    if (updatedData.acknowledged === true) {
      res.send({ message: "liked" });
    }
  } else {
    const updatedData = await post.updateOne(
      { _id: id },
      {
        $pull: {
          likes: userDoc._id,
        },
      },
      { new: true }
    );
    if (updatedData.acknowledged === true) {
      res.send({ message: "like removed" });
    }
  }
};

module.exports = {
  createPostController,
  getAllPostController,
  viewOnePostController,
  deletePostController,
  editPostController,
  addCommentController,
  getCommentController,
  getAllPostByUserController,
  uploadPhotoController,
  likeController,
};
