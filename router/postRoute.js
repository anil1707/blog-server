const express = require('express');
const { createPostController, getAllPostController, viewOnePostController } = require('../controller/postController');
const multer = require('multer')
const uploadMiddleware = multer({dest:"uploads/"})

postRouter = express.Router();

postRouter.post('/createPost',uploadMiddleware.single('files'), createPostController)
postRouter.get('/getPost', getAllPostController)
postRouter.get('/:id', viewOnePostController)

module.exports = {postRouter}