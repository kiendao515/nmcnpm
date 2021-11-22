const mongoose = require('mongoose')

const categorySchema= new mongoose.Schema({
    cost:{type:Number,required:true},
    image:{type:String,required:true},
    description:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
})

const Category= mongoose.model('category',categorySchema);
module.exports={Category};