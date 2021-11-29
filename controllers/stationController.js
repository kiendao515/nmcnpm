const {Station}= require('../model/station')
const {StaffStation}= require('../model/user')
const {Location}= require('../model/location')

const addStation= async(req,res)=>{
    const {staff,location,phoneNumber,name}= req.body;
    let name_lower= name.toLowerCase();
    console.log(name_lower)
    let staff1=await Station.findOne({staff:staff});
    if(staff1){
        return res.json({status:'fail',msg:'This staff has already been in another station'})
    }
    let location1 =await Station.findOne({location:location})
    if(location1){
        return res.json({status:'fail',msg:'This location has already been for another station'})
    }
    if(!staff1 && !location1){
        let station = new Station({staff,location,name,name_lower,phoneNumber});
        await station.save().then(doc=>{
        res.json({status:'success',data:doc})
    })
    }
}

// lat tat ca cac bot
const getStation = async(req,res)=>{
    Station.find().populate("location").populate("staff").then(doc =>{
        res.json({status:'success',data:doc})
    })
}

// lay chi tiet 1  bot
const detailStation = async(req,res)=>{
    Station.find({_id:req.params.id}).populate("location").populate("staff").then(doc=>{
        if(!doc){
            return res.json({status:'fail',data:'no data found'})
        }
        res.json({status:"success",data:doc})
    })
}

// tim kiem bot theo ten
const searchStationByName= async(req,res)=>{
    console.log(req.query.s)
    if(!req.query.s){
        return res.json({status:'fail',msg:'Input search invalid'})
    }
    Station.find({name_lower:{ $regex: '.*' + req.query.s.toLowerCase() + '.*' }}).populate("location").populate("staff").then(doc=>{
        res.json({status:"success",data:doc})
    })
}

exports.addStation= addStation;
exports.getStation= getStation;
exports.detailStation=detailStation;
exports.searchStationByName=searchStationByName;