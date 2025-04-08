const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyRetailerToken } = require('./retailer');

// Get all products for the logged-in retailer
router.get('/', verifyRetailerToken, async (req, res) => {
  try {
    const products = await Product.find({ retailer: req.retailer._id });
    res.json(products);
  } catch (error) {
    console.error('Error fetching retailer products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new product
router.post('/', verifyRetailerToken, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      brand,
      image,
      tags,
      quantity,
      type
    } = req.body;

    console.log('Creating product for retailer:', req.retailer._id);

    // Create new product
    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      brand,
      image,
      tags: tags || [],
      quantity,
      type,
      retailer: req.retailer._id,
      rating: 0,
      reviews: 0
    });

    await product.save();

    // Verify retailer was set correctly
    const savedProduct = await Product.findById(product._id).populate('retailer');
    console.log('Product created with retailer:', savedProduct.retailer ? savedProduct.retailer._id : 'None');

    // Add product to retailer's products array
    req.retailer.products.push(product._id);
    await req.retailer.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get a specific product
router.get('/:id', verifyRetailerToken, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      retailer: req.retailer._id
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a product
router.put('/:id', verifyRetailerToken, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      brand,
      image,
      tags,
      quantity,
      type,
      isActive
    } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      retailer: req.retailer._id
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (brand !== undefined) product.brand = brand;
    if (image !== undefined) product.image = image;
    if (tags !== undefined) product.tags = tags;
    if (quantity !== undefined) product.quantity = quantity;
    if (type !== undefined) product.type = type;
    if (isActive !== undefined) product.isActive = isActive;

    product.updatedAt = Date.now();
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a product
router.delete('/:id', verifyRetailerToken, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      retailer: req.retailer._id
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Instead of deleting, mark as inactive
    product.isActive = false;
    await product.save();

    // Remove from retailer's products array
    req.retailer.products = req.retailer.products.filter(
      id => id.toString() !== req.params.id
    );
    await req.retailer.save();

    res.json({ message: 'Product deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating product:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
