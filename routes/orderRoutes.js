const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.get('/', auth, orderController.getOrders);
router.post('/', auth, orderController.createOrder);
router.delete('/:id', auth, orderController.deleteOrder);
router.patch('/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;
