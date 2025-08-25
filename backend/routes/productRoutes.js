const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/addproduct', productController.addProduct);
router.post('/removeproduct', productController.removeProduct);
router.get('/product/:id', productController.getSingleProduct);
router.put('/updateproduct/:id', productController.updateProduct);
router.get('/allproducts', productController.allProducts);
router.get('/newcollections', productController.newcollections);
router.get('/popularinwomen', productController.popularinwomen);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/checkstock/:id', productController.checkStock);


module.exports = router;
