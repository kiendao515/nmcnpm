const {User} = require('../model/user')
const {HiringBill} = require('../model/hiringBill');
const {Station} = require('../model/station');
const {Category} = require('../model/category');
const {Bike} = require('../model/bike');
const jwt= require('jsonwebtoken');

/**
 * chức năng của user:
 * đặt xe
 * hủy xe
 * xem thông tin hóa đơn
 */

const bookBike = async (req, res) => {
    let check = false;
    let id;
    if(!req.headers.authorization){
        return res.json({status:'fail',msg:'token required'})
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, "kiendao2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            staff = User.find({ _id: decodedToken.userID })
            if (staff) {
                console.log(staff)
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'User not found!' })
            }
        });
        if (check) {
            let {stationID,categoryID}= req.body;
            if (!stationID) {
                return res.json({ status: 'fail', msg: 'staionID is missing' })
            }
            let station = await Station.findOne({ _id: stationID })
            let category= await Category.findOne({_id: categoryID});
            if(station&&category){
                let bike = await Bike.findOne({status:"free",station:stationID, category: categoryID});
                console.log(bike)
                if(!bike){
                    return res.json({status:'fail',msg:'hmm server error'})
                }
                let hiringBill= new HiringBill({user:id,station:stationID,bike:bike._id,rentDate:Date.now()});
                await Bike.findOneAndUpdate({_id:bike._id},{status:"waiting"},{new:true});
                hiringBill.save(doc=>{
                    return res.json({status:'success',msg:'Booking successfully',data:bike})
                })
            }else{
                return res.json({status:'fail',msg:'Fail to book bike'})
            }
        }
    }
}

// xem thông tin đơn đặt
const getBill = async(req,res)=>{
    let check=false;
    let id; 
    if(!req.headers.authorization){
        return res.json({status:'fail',msg:'token required'})
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, "kiendao2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            staff = User.find({ _id: decodedToken.userID })
            if (staff) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'User not found!' })
            }
        });
        if (check) {
            HiringBill.find({user:id}).populate("station").populate("bike").then(doc=>{
                return res.json({status:'success',data:doc})
            })
        }
    }
}



exports.bookBike= bookBike;
exports.getBill= getBill;