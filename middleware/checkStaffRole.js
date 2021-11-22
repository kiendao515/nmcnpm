const {StaffStation } = require('../model/user');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
cookieParser();
const checkReceptionRole = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.json({ msg: "Token required!" })
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.json({msg:"you need to login first"})
  }
  jwt.verify(token, "kiendao2001",function(err,decodedToken) {
    if(err){
      return res.json({msg:"Invalid token"})
    }
    StaffStation.findOne({ _id: decodedToken.userID},function(err,doc){
      if(err){
        return res.json({status:'fail',msg:'Server error!'})
      }else if(!doc){
        return res.json({status:'fail',msg:'Staff role needed!'})
      }
      next();
  });
  });
}
module.exports = checkReceptionRole;