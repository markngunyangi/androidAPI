const {
    Schema,
    model
} = require ('mongoose')

const category = new Schema({
    name:{
        type:String,
        required:true
    },
    imageUrl: {
        type: String,
        required: true
      }
},
{
    timestamps:true
}
);

module.exports = model('Category',category);




