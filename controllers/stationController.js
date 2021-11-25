const {Station}= require('../model/station')
const {StaffStation}= require('../model/user')
const {Location}= require('../model/location')
const mongoose = require('mongoose')

const addStation= async(req,res)=>{
    const {bikeAmount,staff,location}= req.body;
    let staff1=await StaffStation.findOne({_id:staff});
    if(!staff1){
        return res.json({status:'fail',msg:'staff not found!'})
    }
    let location1 =await Location.findOne({_id:location})
    if(!location1){
        return res.json({status:'fail',msg:'Location not found!'})
    }
    let station = new Station({bikeAmount:bikeAmount,staff:staff1._id,location:location1._id});
    await station.save().then(doc=>{
        res.json({status:'success',data:doc})
    })
}

const getStation = async(req,res)=>{
    Station.find().populate("location").populate("staff").then(doc =>{
        res.json({status:'success',data:doc})
    })
}

exports.addStation= addStation;
exports.getStation= getStation;