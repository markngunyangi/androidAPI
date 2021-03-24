const express = require('express');
const { body } = require('express-validator/check');

const categoryController = require('../controllers/category');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

  // GET posts
  router.post('/category',
  isAuth,
  [
    body('name')
      .trim()
      .isLength({ min: 2 }),
  ],   
   categoryController.postCategory);

  module.exports = router;