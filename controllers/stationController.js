const {Station}= require('../model/station')
const {StaffStation}= require('../model/user')
const {Location}= require('../model/location')

const addStation= async(req,res)=>{
    const {bikeAmount,staff,location,phoneNumber,name}= req.body;
    let staff1=await Station.findOne({staff:staff});
    if(staff1){
        return res.json({status:'fail',msg:'This staff has already been in another station'})
    }
    let location1 =await Station.findOne({location:location})
    if(location1){
        return res.json({status:'fail',msg:'This location has already been for another station'})
    }
    if(!staff1 && !location1){
        let station = new Station({bikeAmount,staff,location,name,phoneNumber});
        await station.save().then(doc=>{
        res.json({status:'success',data:doc})
    })
    }
}

const getStation = async(req,res)=>{
    Station.find().populate("location").populate("staff").then(doc =>{
        res.json({status:'success',data:doc})
    })
}



exports.addStation= addStation;
exports.getStation= getStation;