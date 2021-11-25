const {Location}= require('../model/location')

const addLocation= async(req,res)=>{
    const {name,longtitude,latitude}= req.body;
    console.log(name,longtitude);
    Location.findOne({name:name},function(err,doc){
        if(err){
            return res.json({status:'fail',msg:'server error'})
        }else if(doc){
            return res.json({status:'fail',msg:'Tên địa điểm đã tồn tại!'})
        }
    })
    let location= new Location({name,longtitude,latitude})
    await location.save().then(doc=>{
        res.json({status:'success',data:doc})
    })
}

const getLocation = async(req,res)=>{
    Location.find({},(err,doc)=>{
        res.json({status:'success',data:doc})
    })
}

exports.getLocation=getLocation;
exports.addLocation= addLocation;