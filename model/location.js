const mongoose = require('mongoose');
const locationSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    longtitude:{
        type:Number,
        required:false
    },
    latitude:{
        type:Number,
        required:false
    }
})

const LocationStation= mongoose.model('location',locationSchema);
module.exports={LocationStation};