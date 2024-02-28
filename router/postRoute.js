const express = require("express");
const {
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
} = require("../controller/postController");
const multer = require("multer");
const { verifyUser } = require("../middleware/auth");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

postRouter = express.Router();

postRouter.post(
  "/createPost",
  upload.single("files"),
  verifyUser,
  createPostController
);
postRouter.post("/addComment", verifyUser, addCommentController);
postRouter.post(
  "/uploadPhoto",
  upload.single("files"),
  verifyUser,
  uploadPhotoController
);
postRouter.get("/getPost", getAllPostController);
postRouter.get("/getPost/:email", getAllPostByUserController);
postRouter.get("/getComments/:id", getCommentController);
postRouter.get("/:id", viewOnePostController);
postRouter.delete("/delete/:id", verifyUser, deletePostController);
postRouter.put("/edit/:id", verifyUser, editPostController);
postRouter.put(`/like/:id`, verifyUser, likeController);
module.exports = { postRouter };
