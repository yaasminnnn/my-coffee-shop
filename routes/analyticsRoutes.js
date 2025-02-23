const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/sales', auth, adminOnly, analyticsController.getSalesAnalytics);

module.exports = router;
