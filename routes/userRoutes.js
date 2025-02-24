const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRegister, validateLogin, validate } = require('../middleware/validator');
const { auth } = require('../middleware/auth');

router.post('/register', validateRegister, validate, userController.register);
router.post('/login', validateLogin, validate, userController.login);

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
