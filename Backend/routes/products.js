const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: error.message });
    }
  });

router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.json([]);
      }
  
      const searchPattern = new RegExp(q, 'i');
      const products = await Product.find({
        $or: [
          { name: searchPattern },
          { brand: searchPattern },
          { type: searchPattern }
        ]
      });
  
      res.json(products);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Add suggestions route
  router.get('/suggestions', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.json([]);
      }
  
      const searchPattern = new RegExp(q, 'i');
      const suggestions = await Product.find({
        $or: [
          { name: searchPattern },
          { brand: searchPattern },
          { type: searchPattern }
        ]
      })
      .select('name brand price image')
      .limit(5);
  
      res.json(suggestions);
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({ error: error.message });
    }
  });



router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
