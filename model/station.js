const mongoose = require("mongoose");
/**
 * const Int32 = require("mongoose-int32").loadType(mongoose);
 */  
const stationSchema= new mongoose.Schema({
    bikeAmount:{type:Number,required:true},
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
        required:true
    },
    location:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'location',
        required:true 
    }
})
const Station= mongoose.model('station',stationSchema);
module.exports={Station};