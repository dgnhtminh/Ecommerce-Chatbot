const express = require('express');
const fetchUser = require('../middlewares/fetchUser');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/placeorder', fetchUser, orderController.placeOrder);
router.get('/userorders', fetchUser, orderController.userOrders);
router.get('/allorders', orderController.allOrders);
router.post('/updateorderstatus', orderController.updateOrderStatus);
router.post('/removeorder', orderController.removeOrder);
router.post('/cancelorder', fetchUser, orderController.cancelOrder)

module.exports = router;
