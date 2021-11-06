const mongoose = require('mongoose');
const connection= async(req,res)=>{
    try{
        const conn = await mongoose.connect(`mongodb+srv://kiendao:kiendao2001@cluster0.bnqgz.mongodb.net/car-rental?retryWrites=true`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("ket noi db thanh cong ")
    }catch(err){
         console.log(err);
    }
}

module.exports=connection;