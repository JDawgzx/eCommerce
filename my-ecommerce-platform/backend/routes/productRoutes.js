const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);  // Get all products
router.post('/', productController.createProduct); // Create a product

module.exports = router;
