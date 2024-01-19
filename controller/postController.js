const post = require("../model/PostSchema");
let jwt = require("jsonwebtoken");
let JWT_SECRET_KEY = "ANILKUMARYADAV";
let cloudinary = require("../cloudinaryConfig");
const categoryModel = require("../model/Category");

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
const createPostController = (req, res) => {
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  handleUpload(dataURI)
    .then((cldRes) => {
      let { token } = req.cookies;
      jwt.verify(token, JWT_SECRET_KEY, {}, async (err, info) => {
        if (err) throw err;
        if (cldRes) {
          const allCategory = await categoryModel.find();
          let extractCategory = allCategory.find(
            (item) => item.category === req.body.category
          );
          if (!extractCategory?.category) {
            let collection = await categoryModel({
              category: req.body.category,
            });
            collection.save();
          }
          let data = {
            title: req.body.title,
            summary: req.body.summary,
            category: req.body.category,
            content: req.body.content,
            cover: cldRes.secure_url,
            author: info.email,
          };
          const collection = await post(data);
          let result = await collection.save();
          res.send({ message: "Post created successfully", post: result });
        }
      });
    })
    .catch((err) => {
      res.send({ Error: err });
    });
};

const getAllPostController = async (req, res) => {
  try {
    let posts = await post.find();
    res.send({ posts });
  } catch (error) {
    res.send({ Error: error });
  }
};

const getCategoryController = async (req, res) => {
  try {
    let category = await categoryModel.find();
    res.send({ category });
  } catch (error) {
    res.send({ Erorr: error });
  }
};

const viewOnePostController = async (req, res) => {
  try {
    let data = await post.findById(req.params.id);
    res.send(data);
  } catch (error) {
    res.send({ Error: error });
  }
};

const editPostController = async (req, res) => {
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    handleUpload(dataURI).then((cldres) => {
      let { token } = req.cookies;
      jwt.verify(token, JWT_SECRET_KEY, {}, async (err, info) => {
        if (err) throw err;
        let postDoc = await post.findById(req.params.id);
        if (info.email !== postDoc.author) {
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
              cover: cldres ? cldres.secure_url : postDoc.cover,
            },
          }
        );
        res.send({ message: "Updated successfully!" });
      });
    });
  } else {
    let { token } = req.cookies;
    jwt.verify(token, JWT_SECRET_KEY, {}, async (err, info) => {
      if (err) throw err;
      let postDoc = await post.findById(req.params.id);
      if (info.email !== postDoc.author) {
        return res.status(400).json({ message: "invalid author" });
      }
      let result = await post.updateOne(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            summary: req.body.summary,
            content: req.body.content,
          },
        }
      );
      res.send({ message: "Updated successfully!" });
    });
  }
};

const deletePostController = async (req, res) => {
  try {
    let data = await post.deleteOne({ _id: req.params.id });
    if (data?.acknowledged === true) {
      res.send({ message: "Deleted Succussfully!" });
    } else {
      res.send({ message: "Something went wrong" });
    }
  } catch (error) {
    res.send({Error:error})
  }
};

module.exports = {
  createPostController,
  getAllPostController,
  viewOnePostController,
  deletePostController,
  editPostController,
  getCategoryController,
};
