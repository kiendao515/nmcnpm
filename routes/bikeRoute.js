const bikeController= require('../controllers/bikeController')
const checkAdminRole= require('../middleware/checkAdminRole');
const express= require('express');
const router= express.Router();

router.get("/api/v2/bikes",checkAdminRole,bikeController.getBikes);
router.get("/api/v2/bike/detail/:id",checkAdminRole,bikeController.getDetailBike)
router.post("/api/v2/bike/add",checkAdminRole,bikeController.addBike);
router.put("/api/v2/bike/edit/:id",checkAdminRole,bikeController.editBike);
router.delete("/api/v2/bike/delete/:id",checkAdminRole,bikeController.deleteBike);
router.get("/api/v2/station/free",checkAdminRole,bikeController.getStationWithFreeBike);
router.get("/api/v2/statistics/:id",checkAdminRole,bikeController.getStatistics);
router.get("/api/v2/bikes/free/:id",checkAdminRole,bikeController.getFreeBikeFromStation);

module.exports= router;