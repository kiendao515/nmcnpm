const stationController= require('../controllers/stationController');
const checkAdminRole= require('../middleware/checkAdminRole');
const express= require('express');
const router= express.Router();

router.post('/api/v2/station/add',checkAdminRole,stationController.addStation);
router.get('/api/v2/station',checkAdminRole,stationController.getStation);
module.exports= router;