const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    document: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category:{
       type:Schema.Types.ObjectId,
       ref:'Category',
       required:true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);