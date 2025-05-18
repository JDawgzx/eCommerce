// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload');

// GET /api/products?search=&category=&minPrice=&maxPrice=&page=&limit=
// Supports pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const filters = {};

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      filters.category = category;
    }
    if (minPrice) {
      filters.price = { ...filters.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      filters.price = { ...filters.price, $lte: Number(maxPrice) };
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filters);
    const products = await Product.find(filters).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add product with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, inStock } = req.body;
    const productData = {
      name,
      price,
      description,
      category,
      inStock: inStock === 'true' || inStock === true,
    };

    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// PUT update product with optional image upload
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, inStock } = req.body;
    const updateData = {
      name,
      price,
      description,
      category,
      inStock: inStock === 'true' || inStock === true,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// DELETE product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
