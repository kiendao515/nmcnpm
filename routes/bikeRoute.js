const bikeController= require('../controllers/bikeController')
const checkAdminRole= require('../middleware/checkAdminRole');
const express= require('express');
const router= express.Router();

router.get("/api/v2/bikes",checkAdminRole,bikeController.getBikes);
router.post("/api/v2/bike/add",checkAdminRole,bikeController.addBike);
router.get("/api/v2/station/free",checkAdminRole,bikeController.getStationWithFreeBike);
router.get("/api/v2/bikes/free/:id",checkAdminRole,bikeController.getFreeBikeFromStation);

module.exports= router;