// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // your Product mongoose model

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // fetch all products from DB
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// You can add other routes like POST, PUT, DELETE for products here

module.exports = router;
