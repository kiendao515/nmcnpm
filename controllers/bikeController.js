const {Bike}= require('../model/bike');
const {Category} = require('../model/category')
const {Station} = require('../model/station')

const addBike= async(req,res)=>{
    const{category,station,status}=req.body;
    let c= await Category.find({_id:category});
    if(!c){
        return res.json({status:'fail',msg:'Category not found'})
    }
    let s= await Station.find({_id:station});
    if(!s){
        return res.json({status:'fail',msg:'Station not found'})
    }
    if(c&&s){
        let numberPlate = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        let bike= new Bike({category,station,status,numberPlate:"29A"+numberPlate,});
        bike.save().then(doc=>{
            return res.json({status:'success',data:doc})
        })
    }
}

const getBikes= async(req,res)=>{
    try {
        Bike.find().populate("category").populate("station").then(doc=>{
            return res.json({status:'success',data:doc})
        })
    } catch (error) {
        console.log(error);
    }
}

/**
 * Trả về danh sách thông tin của các bốt hiện tại đang có xe rảnh:
 */
const getStationWithFreeBike= async(req,res)=>{
    let bikes;
    try{
        bikes=await Bike.find({$and:[{status:"free"},{isDelete:false}]}).distinct('station');
        console.log(bikes);
    }catch(err){
        console.log(err);
    }
    Station.find({_id: { $in: bikes}}).populate("location").then(doc=>{
        if(!doc)return res.json({status:'success',data:"Out of bike"})
        return res.json({status:'success',data:doc})
    })
}

/**
 * Danh sách xe hiện có sau khi đã lựa chọn bốt
 */
const getFreeBikeFromStation=async(req,res)=>{
    let stationID= req.params.id;
    Bike.find({status:"free",station:stationID}).populate("category").then(doc=>{
        return res.json({status:"success",data:doc})
    })
}

exports.addBike=addBike;
exports.getBikes= getBikes;
exports.getStationWithFreeBike=getStationWithFreeBike;
exports.getFreeBikeFromStation=getFreeBikeFromStation;