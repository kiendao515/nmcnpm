const {Receptionist } = require('../model/user');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
cookieParser();
const checkReceptionRole = async (req, res, next) => {
  let admin;
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
    try {
      admin = Receptionist.findOne({ _id: decodedToken.userID });
    } catch (error) {
      console.log(error);
    }
    if (!admin) {
      return res.json({ msg: "Admin permission needed!" })
    } else {
      next();
    }
  });
}
module.exports = checkReceptionRole;