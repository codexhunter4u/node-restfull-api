const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orderController');

// Handle incoming GET requests to /orders
router.get('/getAll', checkAuth, OrdersController.getAll);

router.post('/create', checkAuth, OrdersController.create);

router.get('/getSingle/:orderId', checkAuth, OrdersController.getSingle);

router.delete('//delete:orderId', checkAuth, OrdersController.delete);

module.exports = router;
