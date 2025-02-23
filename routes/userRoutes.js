const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRegister, validateLogin, validate } = require('../middleware/validator');

router.post('/register', validateRegister, validate, userController.register);
router.post('/login', validateLogin, validate, userController.login);

module.exports = router;
