const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req,res,next) => {
    Post.find()
    .then((postList) => {
        res.status(200).json({
            message: 'Fetched posts successfully.',
            posts: postList
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body.title);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error('No document provided.');
      error.statusCode = 422;
      throw error;    
    }
    const document = req.file.path;
    const title = req.body.title;
    const category = req.body.category;
    const description = req.body.description;
    let creator;
    console.log(category);
    // let isCategory = await Category.findOne({
    //     category
    // })
    // if(!isCategory){
      
    // }

    const post = new Post({
      title: title,
      description: description,
      document: document,
      category:category,
      creator: req.userId
    });
    post
      .save()
      .then(result => {
        return User.findById(req.userId);
      })
      .then(result  => {
        res.status(201).json({
          message: 'Post created successfully!',
          post: post,
        //   creator: { _id:creator._id, name: creator.name }
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    console.log(postId);
    Post.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }  
        res.status(200).json({ message: 'Post fetched.', post: post });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let document = req.body.document;
    if (req.file) {
      document = req.file.path;
    }
    if (!document) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }
    Post.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        if (post.creator.toString() !== req.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        if (document !== post.document) {
          clearDocument(post.document);
        }
        post.title = title;
        post.document = document;
        post.content = content;
        return post.save();
      })
      .then(result => {
        res.status(200).json({ message: 'Post updated!', post: result });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    console.log("postId");
    Post.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        if (post.creator.toString() !== req.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        // Check logged in user
        clearDocument(post.document);
        return Post.findByIdAndRemove(postId);
      })
      .then(result => {
        res.status(200).json({ message: 'Deleted post.' });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  
  const clearDocument = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
  };
  