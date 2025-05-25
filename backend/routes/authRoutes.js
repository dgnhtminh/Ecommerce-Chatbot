const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/loginAdmin', authController.adminLogin);
router.post('/registerAdmin', authController.registerAdmin);

module.exports = router;