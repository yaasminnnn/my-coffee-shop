const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, text: true },
  description: { type: String, text: true },
  price: { type: Number, required: true },
  imageUrl: String,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
