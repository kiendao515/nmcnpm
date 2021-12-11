const express= require('express');
const router= express.Router();
const hiringController= require('../controllers/hiringBillcontroller');

// user
router.post('/api/v3/user/book/bike',hiringController.bookBike);
router.get('/api/v3/user/booking/history',hiringController.getBill);

module.exports= router;