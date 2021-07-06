const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const ordersController = require('../controllers/orders-controller');
const login = require('../middleware/login');


router.get('', ordersController.getOrders);

router.get('/:order_id', ordersController.getOrdersById);

router.post('', login, ordersController.postOrder);  

router.delete('/:order_id',ordersController.deleteOrder);



module.exports = router;