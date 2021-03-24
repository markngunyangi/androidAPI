const express = require('express');
const { body } = require('express-validator/check');

const postController = require('../controllers/post');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST post
router.post(
    '/post',
    isAuth,
    [
      body('title')
        .trim()
        .isLength({ min: 5 }),
      body('description')
        .trim()
        .isLength({ min: 5 })
    ],
    postController.createPost
  );

  // GET posts
router.get('/posts', isAuth, postController.getPosts);


router.get('/post/:postId', isAuth, postController.getPost);

router.put(
    '/post/:postId',
    isAuth,
    [
      body('title')
        .trim()
        .isLength({ min: 5 }),
      body('content')
        .trim()
        .isLength({ min: 5 })
    ],
    postController.updatePost
  );

  router.delete('/post/:postId', isAuth, postController.deletePost);


  module.exports = router;