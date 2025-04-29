const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/allusers', userController.allUsers);
router.post('/removeuser', userController.removeUser);

module.exports = router;