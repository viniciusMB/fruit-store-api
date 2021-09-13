const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const customersController = require('../controllers/customers-controller');
const login = require('../middleware/login');


router.get('', login, customersController.getCustomers);

router.get('/byid', login, customersController.getCustomerById);

router.post('', customersController.postCustomer);

router.patch('', login, customersController.updateCustomer);

router.delete('/:customer_id', customersController.deleteCustomer);

router.get('/details/byid', login, customersController.getCustomerDetails);



module.exports = router; 