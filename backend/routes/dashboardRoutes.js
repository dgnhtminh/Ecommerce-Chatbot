const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.stats)
router.get('/monthly-revenue', dashboardController.getMonthlyRevenue);

module.exports = router;
