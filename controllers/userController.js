const { Receptionist, StaffStation, Admin, User } = require('../model/user');
const Token = require('../model/token')
const { createJwtToken } = require("../util/auth")
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const SendEmail = require('../util/sendEmail')
const crypto = require("crypto");

// register - dang ky tai khoan
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' })
    }
    const { identifyNumber, userName, password, email, phoneNumber, address, name, residentID } = req.body;
    let user;
    let users;
    try {
        user = await User.findOne({ email });
    } catch (err) {
        console.errors(err.message)
        res.status(500).send({ msg: 'Server Error' })
    }
    if (user) {
        return res.status(200).json({ msg: 'User already exists, please login instead.' })
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.errors(err.message);
        res.status(500).send({ msg: 'Server Error' });
    }

    users = await User.find({});
    if (users) {
        let identityNumberArray = users.map(data => data.identifyNumber);
        let phoneNumberArray = users.map(data => data.phoneNumber);
        if (identityNumberArray.includes(identifyNumber)) {
            return res.status(200).json({ status: 'fail', msg: 'Indentity number existed!' })
        } else if (phoneNumberArray.includes(phoneNumber)) {
            return res.status(200).json({ status: 'fail', msg: 'Telephone number existed !' })
        }
    }

    user = new User({
        identifyNumber, userName:"", password: hashedPassword, email, phoneNumber, address:"", name, balance:0, residentID, activate: "false", role: "user"
    })
    try {
        await user.save().then(doc => {
            const token = createJwtToken(doc._id);
            res.cookie(token);
            res.json({ status: 'unauthenticated', token: token })
        });
    } catch (err) {
        console.log(err);
    }
}

// login - dang nhap tai khoan thuong
const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' });
    }
    const { email, password } = req.body;
    let user;
    try {
        user = await User.findOne({ email: email });
    } catch (err) {
        console.log(err)
    }
    if (!user) {
        return res.status(403).json({ msg: 'Email not found' })
    }

    let check = false;
    try {
        check = await bcrypt.compare(password, user.password);
    } catch (err) {
        console.errors(err.message);
        res.status(500).send({ msg: 'Server Error' });
    }
    if (!check) {
        return res.json({ status: 'fail', msg: 'Password is not match' });
    }
    if (user.activate === "false") {
        return res.json({ status: 'fail', msg: 'You need to see receptionist to activate your account' })
    }
    const token = createJwtToken(user._id)
    res.cookie('token', token)
    return res.json({ status: 'success', msg: 'login successfully' })
}

// login - dang nhap tai khoan admin
const adminLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' });
    }
    const { email, password } = req.body;
    Admin.findOne({ email: email },  (err, doc) => {
        if (err) {
            return res.json({ stauts: 'fail', msg: 'server error' })
        } else if (!doc) {
            return res.json({ status: 'fail', msg: 'Can not find that email !' })
        }
        else if (password !== doc.password) {
            return res.json({ status: 'fail', msg: 'Password is not match!' })
        }
        return res.json({ status: "success", token: createJwtToken(doc._id) });
    })
}

/**chuc nang cua admin
 * + get account (staff || receptionist)
 * + get detail account (staff || receptionist)
 * + add account (staff || receptionist) 
 * + edit account (staff || receptionist)
 * + delete account 
 * */
const changePass= async(req,res)=>{
    try{
        await Admin.findOneAndUpdate({password:req.body.password},{password:req.body.newpass},{new:true}).then(doc=>{
            if(!doc){
                return res.json({status:false,msg:'Password is not found!'})
            }
            return res.json({status:true,msg:'Update new password successfully!'})
        })
    }catch(err){

    }
}
const addAccount = async (req, res) => {
    const role = req.query.type;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' })
    }
    const { identifyNumber, userName, password, email, name, phoneNumber, address } = req.body;
    let user;
    const roles=["staff","receptionist"]
    if(!roles.includes(role)){
        return res.json({status:false,msg:'Role not found'})
    }
    if (role === 'staff') {
        user = await StaffStation.findOne({ email: email });
    } else if (role === 'receptionist') {
        user = await Receptionist.findOne({ email: email });
    }
    console.log(user)
    if (user) {
        return res.status(200).json({ msg: 'Email already existed' })
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.errors(err.message);
        res.status(500).send({ msg: 'Server Error' });
    }
    if (role === "staff") {
        user = new StaffStation({
            identifyNumber, userName, password: hashedPassword, email, phoneNumber, address, name, staffID: Date.now(), role: "staff"
        })
    } else if (role === "receptionist") {
        user = new Receptionist({
            identifyNumber, userName, password: hashedPassword, email, phoneNumber, address, name, receptionistID: Date.now(), role: "receptionist"
        })
    }

    try {
        await user.save().then(doc => {
            res.json({ status: "success", data: doc })
        });
    } catch (err) {
        console.log(err);
    }
}

const editAccount = async (req, res) => {
    const role = req.query.type.split('/')[0];
    const id = req.query.type.split('/')[1];
    console.log(role, id)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' })
    }
    const roles=["staff","receptionist"]
    if(!roles.includes(role)){
        return res.json({status:false,msg:'Role not found'})
    }
    try {
        if (role === 'staff') {
            StaffStation.find({ _id: id }, (err, doc) => {
                if (!doc) {
                    return res.json({ status: 'fail', msg: 'url request invalid' })
                }
            })
            StaffStation.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(doc => {
                res.json({ status: 'success', data: doc });
            })
        } else if (role === 'receptionist') {
            Receptionist.find({ _id: id }, (err, doc) => {
                if (!doc) {
                    return res.json({ status: 'fail', msg: 'url request invalid' })
                }
            })
            Receptionist.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(doc => {
                res.json({ status: 'success', data: doc })
            })
        }
    } catch (err) {
        return res.json({ status: 'fail', msg: 'url requets invalid!' })
    }
}

const deleteAccount = async (req, res) => {
    const role = req.query.type.split('/')[0];
    const id = req.query.type.split('/')[1];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(200).json({ msg: 'Invalid input, please check your data' })
    }
    const roles=["staff","receptionist"]
    if(!roles.includes(role)){
        return res.json({status:false,msg:'Role not found'})
    }
    if (role === 'staff') {
        try {
            StaffStation.findOneAndRemove({ _id: id }, function (err, doc) {
                if (err) {
                    return res.status(500).json({ status: 'fail', msg: 'error server' })
                } else if (!doc) {
                    return res.status(404).json({ status: 'fail', msg: "can not found document" })
                }
                return res.json({ status: 'success', data: doc })
            })
        } catch (error) {
            res.json({ status: 'fail', msg: 'url request invalid ' })
        }
    }
    if (role === 'receptionist') {
        try {
            Receptionist.findOneAndRemove({ _id: id }, function (err, doc) {
                if (err) {
                    return res.status(500).json({ status: 'fail', msg: 'error server' });
                } else if (!doc) {
                    return res.status(404).json({ status: 'fail', data: "can not found document" })
                }
                return res.json({ status: 'success', data: doc })
            })
        } catch (error) {
            return res.json({ status: 'success', msg: 'url request invalid' })
        }
    }
}

const getAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' });
    }
    const role = req.query.type;
    console.log(role);
    const roles=["staff","receptionist"]
    if(!roles.includes(role)){
        return res.json({status:false,msg:'Role not found'})
    }
    if (role === 'receptionist') {
        Receptionist.find({}, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 'fail', msg: 'error' })
            }
            return res.json({ status: "success", data: doc })
        })
    }
    if (role === 'staff') {
        StaffStation.find({}, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 'fail', msg: 'error' })
            }
            return res.json({ status: "success", data: doc })
        })
    }

    // return res.json({status:false,msg:'role not found'})
}

const getDetailAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' })
    }
    const role = req.query.type.split('/')[0];
    const id = req.query.type.split('/')[1]
    console.log(role, id)
    const roles=["staff","receptionist"]
    if(!roles.includes(role)){
        return res.json({status:false,msg:'Role not found'})
    }
    if (role === 'receptionist') {
        try {
            Receptionist.findOne({ _id: id }, function (err, doc) {
                if (err) {
                    return res.status(500).json({ status: 'fail', msg: 'error server' });
                } else if (!doc) {
                    return res.status(404).json({ status: 'fail', data: "can not found document" })
                }
                return res.json({ status: 'success', data: doc })
            })
        } catch (error) {
            return res.json({ status: 'success', msg: 'url request invalid' })
        }
    }
    if (role === 'staff') {
        try {
            StaffStation.findOne({ _id: id }, function (err, doc) {
                if (err) {
                    return res.status(500).json({ status: 'fail', msg: 'error server' });
                } else if (!doc) {
                    return res.status(404).json({ status: 'fail', data: "can not found document" })
                }
                return res.json({ status: 'success', data: doc })
            })
        } catch (error) {
            return res.json({ status: 'success', msg: 'url request invalid' })
        }
    }
}

const searchAccount = async (req, res) => {
    const errors = validationResult(req);
    let staff, receptionist;
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' })
    }
    const q = req.query.q
    if (!q) {
        return res.json({ status: 'fail', msg: 'Bad request!' })
    }
    try {
        staff = StaffStation.find({ $or: [{ userName: q }, { phoneNumber: q }, { email: q }] }, (err, doc) => {
            staff = doc;
        })
        receptionist = Receptionist.find({ $or: [{ userName: q }, { phoneNumber: q }, { email: q }] })
        console.log(staff.toJson({ getters: true, virtuals: false }), receptionist.toObject({ getters: true, virtuals: false }))
        return res.json({ status: 'fail', staff: staff, receptionist: receptionist })
    } catch (error) {

    }

}

const forgetPass = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' })
    }
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    if (!user)
        return res.status(400).json({ status: 'fail', msg: 'Email not found' });
    const n = crypto.randomInt(100000, 999999);
    console.log(n);
    const newpass= await bcrypt.hash(n.toString(),12);
    // const link = `http://locahost:5000/api/v1/password-reset/${user._id}/${data.token}`
    await SendEmail(user.email, "Your new password", n);
    await User.findOneAndUpdate({ email: user.email },{password:newpass},{ new: true }).then(doc => {
        res.json({ status: true, msg: 'Check your email to receive new password' })
    })
}
/**
 * chuc nang cua receptionist
 * dang nhap
 * add users, edit user, delete user, get users , activate account , get account that not activated
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const receptionistLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    let admin;
    try {
        admin = await Receptionist.findOne({ email: email });
    } catch (error) {
        console.log(error)
    }
    if (!admin) {
        return res.json({ status: 'fail', msg: 'email not found' })
    }
    let check = false;
    try {
        check = await bcrypt.compare(password, admin.password);
    } catch (err) {
        console.log(err)
    }
    if (!check) {
        return res.json({ status: 'fail', msg: 'Password is not match!' })
    }
    const token = createJwtToken(admin._id)
    res.cookie('token', token)
    return res.json({ msg: "login successfully", token: token });
}

// getAllUser
const getAllUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ msg: 'Invalid input, please check your data' });
    }
    try {
        await User.find({}, (err, doc) => {
            res.json(doc);
        })
    } catch (error) {
        console.log(error);
    }
}

// activate acc
const activate = async (req, res) => {
    let user;
    console.log(req.params)
    try {
        await User.findOneAndUpdate({ _id: req.params.id }, { activate: "true" }, { new: true }, (err, doc) => {
            res.json({ status: 'success', data: doc })
        })

    } catch (err) {
        console.log(err)
    }
}

// get all un activated account
const getUnactivatedAccount = async (req, res) => {
    try {
        User.find({ activate: 'false' }, (err, doc) => {
            res.json({ status: 'success', data: doc })
        })
    } catch (err) {
        console.log(err)
    }
}


/**
 * chức năng của staff
 * -đăng nhập, thêm xe 
 */
const staffLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    let admin;
    try {
        admin = await StaffStation.findOne({ email: email });
    } catch (error) {
        console.log(error)
    }
    if (!admin) {
        return res.json({ status: 'fail', msg: 'email not found' })
    }
    let check = false;
    try {
        check = await bcrypt.compare(password, admin.password);
    } catch (err) {
        console.log(err)
    }
    if (!check) {
        return res.json({ status: 'fail', msg: 'Password is not match!' })
    }
    const token = createJwtToken(admin._id)
    res.cookie('token', token)
    return res.json({ msg: "login successfully", token: token });
}

exports.changePass= changePass;
exports.forgetPass = forgetPass;
exports.searchAccount = searchAccount;
exports.staffLogin = staffLogin;
exports.register = register;
exports.login = login;
exports.addAccount = addAccount;
exports.getAccount = getAccount;
exports.getAllUser = getAllUser;
exports.adminLogin = adminLogin;
exports.editAccount = editAccount;
exports.deleteAccount = deleteAccount;
exports.receptionistLogin = receptionistLogin;
exports.activate = activate;
exports.getUnactivatedAccount = getUnactivatedAccount;
exports.getDetailAccount = getDetailAccount;