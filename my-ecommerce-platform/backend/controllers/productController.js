const Product = require('../models/Product');

// Controller to get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err });
  }
};

// Controller to create a product
exports.createProduct = async (req, res) => {
  const { name, description, price, image } = req.body;
np
  try {
    const product = new Product({ name, description, price, image });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err });
  }
};
