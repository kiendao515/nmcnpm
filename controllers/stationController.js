const {Station}= require('../model/station')
const {StaffStation}= require('../model/user')
const {Location}= require('../model/location')

const addStation= async(req,res)=>{
    const {staff,location,phoneNumber,name}= req.body;
    let name_lower= name.toLowerCase();
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

const editStation=async(req,res)=>{
    const {employee,place,phoneNumber,name}= req.body;
    let name_lower= name.toLowerCase();
    let id= req.params.id;
    let station=await Station.findOne({_id:id});
    if(!station){
        return res.json({status:'fail',msg:'This station is not found'})
    }
    let check=true;
    let location1 =await Station.findOne({location:place})
    if(location1 && (JSON.stringify(station)!==JSON.stringify(location1))){
        check=false;
        return res.json({status:'fail',msg:'This location has already been for another station'})
    }
    let staff1 =await Station.findOne({staff:employee})
    if(staff1 && (JSON.stringify(station)!==JSON.stringify(staff1))){
        check=false;
        return res.json({status:'fail',msg:'This staff has already been for another station'})
    }
    if(check){
        Station.findOneAndUpdate({_id:id},{staff:employee,location:place,name,name_lower,phoneNumber},{new:true},(err,doc)=>{
            if(err){
                return res.json({status:'fail',msg:'server error'})
            }
            if(!doc){
                return res.json({status:'fail',msg:'Can not find station with this id'})
            }
            return res.json({status:'success',msg:'update successfully'})
        })
    }
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

//xóa bốt
const deleteStation= async(req,res)=>{
    let id= req.params.id;
    Station.findOneAndRemove({_id:id},(err,doc)=>{
        if(err){
            return res.json({status:'fail',msg:'server error'})
        }
        if(!doc){
            return res.json({status:'fail',msg:'Can not find station with this id'})
        }
        return res.json({status:'fail',msg:'Delete successfully'})
    })
}

exports.addStation= addStation;
exports.getStation= getStation;
exports.detailStation=detailStation;
exports.searchStationByName=searchStationByName;
exports.editStation=editStation;
exports.deleteStation=deleteStation;