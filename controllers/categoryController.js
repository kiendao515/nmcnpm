const { Receptionist, StaffStation, Admin, User} = require('../model/user');
const {Category}= require('../model/category')
const { Token } = require('../model/token')
const { createJwtToken } = require("../util/auth")
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

/**
 * add category
 */
const addCategory= async(req,res)=>{
    const {}
}

