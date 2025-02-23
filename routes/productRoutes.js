const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, adminOnly, productController.createProduct);
router.put('/:id', auth, adminOnly, productController.updateProduct);
router.delete('/:id', auth, adminOnly, productController.deleteProduct);

module.exports = router;
