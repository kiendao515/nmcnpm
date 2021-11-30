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
    let sort= req.query.sortBy;
    console.log(sort)
    switch (sort) {
        case "free":
            try {
                Bike.find({status:sort}).populate("category").populate({path:"station",populate:{path:"location"}}).then(doc=>{
                    return res.json({status:'success',data:doc})
                })
            } catch (error) {
                console.log(error);
            }
            break;
        case "hiring":
            try {
                Bike.find({status:sort}).populate("category").populate({path:"station",populate:{path:"location"}}).then(doc=>{
                    return res.json({status:'success',data:doc})
                })
            } catch (error) {
                console.log(error);
            }
            break;
        case "waiting":
            try {
                Bike.find({status:sort}).populate("category").populate({path:"station",populate:{path:"location"}}).then(doc=>{
                    return res.json({status:'success',data:doc})
                })
            } catch (error) {
                console.log(error);
            }
            break;
        case "priceLowToHigh":
            try {
                const bikes = await Bike.aggregate([
                    {
                      $lookup: {
                        localField: "category",
                        foreignField: "_id",
                        from: "categories",
                        as: "category"
                      }
                    },
                    {
                        $unwind: "$category"
                    },
                    {
                      $sort: {
                        "category.cost": 1
                      }
                    }
                ])
                return res.json({status:'success',data:bikes})
            } catch (error) {
                console.log(error);
            }
            break;
        case "priceHighToLow":
            try {
                const bikes = await Bike.aggregate([
                    {
                      $lookup: {
                        localField: "category",
                        foreignField: "_id",
                        from: "categories",
                        as: "category"
                      }
                    },
                    {
                        $unwind: "$category"
                    },
                    {
                      $sort: {
                        "category.cost": -1
                      }
                    }
                ])
                return res.json({status:'success',data:bikes})
            } catch (error) {
                console.log(error);
            }
        default:
            res.json({status:'fail',msg:'sortBy parameter not found'})
            break;
    }
}

// chi tiết 1 xe
const getDetailBike= async(req,res)=>{
    let id= req.params.id;
    Bike.find({_id:id}).populate("category").populate({path:"station",populate:{path:"location"}}).then(doc=>{
        if(!doc){
            return res.json({status:'fail',msg:'Can not find bike with this id'})
        }
        return res.json({status:'success',data:doc})
    })
}

// chỉnh sửa tt xe
const editBike = async (req,res)=>{
    let id= req.params;
    Bike.findOneAndUpdate({_id:id},req.body,{new:true},(err,doc)=>{
        if(err){
            return res.json({status:'fail',msg:'server error'})
        }
        if(!doc){
            return res.json({status:'fail',msg:'Can not find bike with this id'})
        }
        return res.json({status:'success',msg:'update successfully'})
    })
}

const deleteBike= async(req,res)=>{
    let id= req.params.id;
    Bike.findOneAndRemove({_id:id},(err,doc)=>{
        if(err){
            return res.json({status:'fail',msg:'server error'})
        }
        if(!doc){
            return res.json({status:'fail',msg:'Can not find bike with this id'})
        }
        return res.json({status:'fail',msg:'Delete successfully'})
    })
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
    Station.find({_id: { $in: bikes}}).populate("location").populate("staff").then(doc=>{
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

/**
 * thống kê xe sau khi chọn bốt
 */
const getStatistics= async(req,res)=>{
    let stationID= req.params.id;
    getCounts(stationID).then(doc=>{res.json({status:'success',data:doc})}).catch((err)=>console.log(err))
}

async function getCounts(stationID) {
    let [free,hiring,waiting,breakdown] = await Promise.all([Bike.countDocuments({status:"free",station:stationID}),Bike.countDocuments({status:"hiring",station:stationID}),
    Bike.countDocuments({status:"waiting",station:stationID}),Bike.countDocuments({status:"breakdown",station:stationID})]);
    return {free,hiring,waiting,breakdown};
}


exports.addBike=addBike;
exports.getBikes= getBikes;
exports.getDetailBike= getDetailBike;
exports.editBike=editBike;
exports.deleteBike= deleteBike;
exports.getStationWithFreeBike=getStationWithFreeBike;
exports.getFreeBikeFromStation=getFreeBikeFromStation;
exports.getStatistics=getStatistics;