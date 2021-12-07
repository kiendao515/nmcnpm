const categoryController= require('../controllers/categoryController');
const checkAdminRole= require('../middleware/checkAdminRole');
const checkReceptionistRole= require('../middleware/checkReceptionistRole');
const express= require('express');
const router= express.Router();

router.post('/api/v2/category/add',checkAdminRole,categoryController.addCategory);
router.get('/api/v2/category',checkAdminRole,categoryController.getCategory);
router.get('/api/v2/category/detail/:id',categoryController.getDetailCategory);
module.exports= router;