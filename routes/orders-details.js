const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const orderDetailsController = require('../controllers/orders-details-controller');


router.post('', orderDetailsController.postOrderDetails);

router.patch('', orderDetailsController.updateOrderDetails);



module.exports = router;