const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const categoryRoutes = require('./routes/category');

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'paperDetails');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.parse(new Date())}-${file.originalname}`);
    }
  })

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

app.use(bodyParser.json());

app.use(multer({
    storage: storage,
    fileFilter: fileFilter
  }).single("uploadfile"));
  app.use(express.static(path.join(__dirname, "paperDetails")));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/category', categoryRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

  mongoose
  .connect(
    'mongodb://localhost:27017/apiedudocsDB'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
  