let fs = require("fs");
const post = require("../model/PostSchema");
let jwt = require("jsonwebtoken");
let JWT_SECRET_KEY = 'ANILKUMARYADAV'

const createPostController = async (req, res) => {
  let { originalname, path } = req.file;
  let parts = originalname.split(".");
  let extension = parts[parts.length - 1];
  let newPath = path + "." + extension;
  fs.renameSync(path, newPath);
  let { token } = req.cookies;
  jwt.verify(token, JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    let data = {
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        cover: newPath,
        author: info.email
      };
      const collection = await post(data);
      let result = await collection.save();
      res.send({ message: "Post created successfully", post: result });
  });
  
};

const getAllPostController = async (req, res) => {
  let posts = await post.find()
  res.send({ posts });
};

const viewOnePostController = async (req,res) =>{
    let data = await post.findById(req.params.id)
    res.send(data)

}

const deletePostController = async (req, res)=>{
  let data = await post.deleteOne({_id:req.params.id})
  if(data?.acknowledged === true){
    res.send({message:"Deleted Succussfully!"})
  }
}

module.exports = { createPostController, getAllPostController, viewOnePostController, deletePostController };
