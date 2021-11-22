const mongoose = require('mongoose');
var Int32 = require('mongoose-int32');
const stationSchema= new mongoose.Schema({
    bikeAmount:{type:Int32,required:true},
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stationStaff"
    },
    location:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "location"
    }
})
const Station= mongoose.model('station',stationSchema);
module.exports={Station};