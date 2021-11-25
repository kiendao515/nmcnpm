const { Receptionist, StaffStation, Admin, User} = require('../model/user');
const {Category}= require('../model/category')
const { Token } = require('../model/token')
const { createJwtToken } = require("../util/auth")
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

/**
 * add category
 * get category 
 */
const addCategory= async(req,res)=>{
    const {cost,image,description,name}= req.body;
    let category= new Category({cost,image,description,name});
    Category.findOne({name:name},function(err,doc){
        if(err){
            return res.json({status:'fail',msg:'server error'})
        }else if(doc){
            return res.json({status:'fail',msg:'Tên danh mục đã tồn tại!'})
        }
    })
    await category.save().then(doc=>{
        res.json({status:'success',data:doc})
    })
}

const getCategory = async(req,res)=>{
    Category.find({},(err,doc)=>{
        return res.json({status:'successs',data:doc})
    })
}

exports.addCategory= addCategory;
exports.getCategory= getCategory;

