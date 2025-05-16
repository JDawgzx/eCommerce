const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const Product = require('../models/Product');

// Only business owner can access these
router.post('/product', auth, authorizeRole('owner'), async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

router.put('/product/:id', auth, authorizeRole('owner'), async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/product/:id', auth, authorizeRole('owner'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
