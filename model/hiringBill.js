const mongoose = require("mongoose");
const hiringBillSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    station:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'station',
        required:true 
    },
    endStation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'station',
        required:false,
    },
    bike:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'bike',
        required:true
    },
    rentDate:{
        type:String,
        required:true
    },
    endDate:{
        type:String,
        required:false
    },
    isDelete:{
        type:Boolean,
        required:true,
        default:false
    }
})
const HiringBill= mongoose.model('bill',hiringBillSchema);
module.exports={HiringBill};