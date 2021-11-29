const userController= require('../controllers/userController');
const auth= require('../middleware/auth');
const checkAdminRole= require('../middleware/checkAdminRole');
const checkReceptionistRole= require('../middleware/checkReceptionistRole');
const checkStaffRole= require('../middleware/checkStaffRole');
const express= require('express');
const { check } = require('express-validator');
const router= express.Router();

/**
 *  cac chuc nang cua normal user 
 *  login
 *  register
 */
router.post('/api/v1/user/register',userController.register);
router.post('/api/v1/user/login',userController.login);
router.post('/api/v1/user/forgetpass',userController.forgetPass);
router.post('/api/v1/user/changepass/:id',userController.normalUserChangePass);
// ------ end user ------

/**
 * cac chuc nang cua admin
 * login
 * add account(receptionist || station staff)
 */
router.post('/api/v1/admin/login',userController.adminLogin);
router.post('/api/v1/admin/changepass',checkAdminRole,userController.changePass);
router.post('/api/v1/accounts/add',checkAdminRole,userController.addAccount);
router.post('/api/v1/accounts/edit',checkAdminRole,userController.editAccount);
router.delete('/api/v1/accounts/delete',checkAdminRole,userController.deleteAccount);
router.get('/api/v1/accounts',checkAdminRole,userController.getAccount);
router.get("/api/v1/account",checkAdminRole,userController.getDetailAccount);
router.get("/api/v1/account/search",checkAdminRole,userController.searchAccount);
// ------ end admin ------


/**
 * cac chuc nang cua receptionist
 * login, register
 * lay tat ca tai khoan users
 * them tai khoan user, activate, edit, delete, getAll Unactivated account 
 */
router.post('/api/v1/receptionist/login',userController.receptionistLogin)
router.get('/api/v1/users',checkReceptionistRole,userController.getAllUser);
router.post('/api/v1/user/activate/:id',checkReceptionistRole,userController.activate);
router.get('/api/v1/unactivated/users',checkReceptionistRole,userController.getUnactivatedAccount);


/**
 * cac chuc nang cua staff
 * -dang nhap
 */
router.post('/api/v1/staff/login',userController.staffLogin);

module.exports= router;