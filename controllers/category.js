const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Category = require("../models/categories")

exports.postCategory = (req,res,next) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
    const name = req.body.name;
    const imageUrl = req.file.path;
    console.log(name);
    const category = new Category({
        name,
        imageUrl
    });
    category
      .save()
      .then(result => {
        res.status(201).json({
          message: 'Category created successfully!',
          category: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}