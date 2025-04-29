const express = require('express');
const couponController = require('../controllers/couponController');

const router = express.Router();

router.post('/validate-coupon', couponController.validateCoupon);
router.get('/allcoupons', couponController.allCoupons);
router.post('/addcoupon', couponController.addCoupon);
router.post('/removecoupon', couponController.removeCoupon);
router.put('/updatecoupon/:id', couponController.updateCoupon);
router.get('/:id', couponController.getSingleCoupon);

module.exports = router;
