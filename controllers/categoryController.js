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
 * xem chi tiết 1 category 
 */
const addCategory= async(req,res)=>{
    const {cost,image,description,name}= req.body;
    let name_lower= name.toLowerCase();
    let category= new Category({cost,image,description,name,name_lower});
    Category.findOne({name_lower:name_lower},function(err,doc){
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

const getDetailCategory = async(req,res)=>{
    let id = req.params.id;
    if(!id){
        return res.json({status:'fail',msg:'Missing id parameter'})
    }
    Category.find({_id:id},(err,doc)=>{
        if(err){
            return res.json({status:'fail',msg:'server error'})
        }
        if(!doc){
            return res.json({statú:'fail',msg:'category not found'})
        }
        return res.json({status:'success',data:doc})
    })
}

exports.addCategory= addCategory;
exports.getCategory= getCategory;
exports.getDetailCategory=getDetailCategory;

