const express = require('express');
const { createPostController, getAllPostController, viewOnePostController, deletePostController, editPostController, getCategoryController } = require('../controller/postController');
const multer = require('multer')
// const uploadMiddleware = multer({dest:"uploads/"})
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

postRouter = express.Router();

postRouter.post('/createPost',upload.single('files'), createPostController)
postRouter.get('/getPost', getAllPostController)
postRouter.get('/getCategory', getCategoryController)
postRouter.get('/:id', viewOnePostController)
postRouter.delete('/delete/:id', deletePostController)
postRouter.put(`/edit/:id`,upload.single('files') , editPostController)

module.exports = {postRouter}