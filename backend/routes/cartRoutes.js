const express = require('express');
const fetchUser = require('../middlewares/fetchUser');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/addtocart', fetchUser, cartController.addToCart);
router.post('/removefromcart', fetchUser, cartController.removeFromCart);
router.get('/getcart', fetchUser, cartController.getCart);
router.post('/clearcart', fetchUser, cartController.clearCart);

module.exports = router;
