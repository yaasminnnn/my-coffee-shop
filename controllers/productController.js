const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { $text: { $search: search } };
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, adminOnly, async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const newProduct = new Product({ name, description, price, imageUrl, category });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
