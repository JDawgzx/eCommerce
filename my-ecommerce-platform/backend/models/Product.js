// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  inStock: { type: Boolean, default: true },
  image: String, // will store image file path
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
