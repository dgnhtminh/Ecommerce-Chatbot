const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const fetchUser = require('../middlewares/fetchUser');

router.get('/allusers', userController.allUsers);
router.post('/removeuser', userController.removeUser);
router.get('/profile', fetchUser, userController.profile)
router.put('/changeProfile', fetchUser, userController.changeProfile)

module.exports = router;