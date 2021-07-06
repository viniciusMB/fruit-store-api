const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const productsController = require('../controllers/products-controller');
const login = require('../middleware/login');


router.get('', productsController.getProducts);

router.get('/:product_id', productsController.getProductsById);

router.post('', productsController.postProduct);

router.patch('', login, productsController.updateProduct);

router.delete('/:product_id', login, productsController.deleteProduct);



module.exports = router;