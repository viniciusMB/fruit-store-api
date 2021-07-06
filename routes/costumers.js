const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const costumersController = require('../controllers/costumers-controller');
const login = require('../middleware/login');


router.get('', login, costumersController.getCostumers);

router.get('/byid', login, costumersController.getCostumerById);

router.post('', costumersController.postCostumer);

router.patch('', login, costumersController.updateCostumer);

router.delete('/:costumer_id', costumersController.deleteCostumer);

router.get('/details/byid', login, costumersController.getCostumerDetails);



module.exports = router; 