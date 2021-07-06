const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const authController = require('../controllers/authentication-controller');

router.post('', authController.login);

module.exports = router;