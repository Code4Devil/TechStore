const express = require('express');
const Retailer = require('../models/Retailer');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify retailer token
const verifyRetailerToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const retailer = await Retailer.findById(decoded.id).select('-password');
    
    if (!retailer) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.retailer = retailer;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Not authorized' });
  }
};

// Register a new retailer
router.post('/register', async (req, res) => {
  const { name, email, password, businessName, businessAddress, phone } = req.body;
  
  try {
    // Check if retailer already exists
    const retailerExists = await Retailer.findOne({ email });
    if (retailerExists) {
      return res.status(400).json({ error: 'Retailer already exists with this email' });
    }
    
    // Create new retailer
    const retailer = new Retailer({
      name,
      email,
      password,
      businessName,
      businessAddress,
      phone,
      products: []
    });
    
    await retailer.save();
    
    // Generate JWT token
    const token = jwt.sign({ id: retailer._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
    
    // Return retailer without password
    const retailerResponse = retailer.toObject();
    delete retailerResponse.password;
    
    res.status(201).json({
      retailer: retailerResponse,
      token
    });
  } catch (error) {
    console.error('Error during retailer registration:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login retailer
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find retailer
    const retailer = await Retailer.findOne({ email });
    
    if (!retailer || !(await retailer.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: retailer._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
    
    // Return retailer without password
    const retailerResponse = retailer.toObject();
    delete retailerResponse.password;
    
    res.json({
      retailer: retailerResponse,
      token
    });
  } catch (error) {
    console.error('Error during retailer login:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get retailer profile
router.get('/profile', verifyRetailerToken, async (req, res) => {
  try {
    const retailer = await Retailer.findById(req.retailer._id)
      .select('-password')
      .populate('products');
    
    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    
    res.json(retailer);
  } catch (error) {
    console.error('Error fetching retailer profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update retailer profile
router.put('/profile', verifyRetailerToken, async (req, res) => {
  const { name, businessName, businessAddress, phone, logo } = req.body;
  
  try {
    const retailer = await Retailer.findById(req.retailer._id);
    
    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    
    // Update fields
    if (name) retailer.name = name;
    if (businessName) retailer.businessName = businessName;
    if (businessAddress) retailer.businessAddress = businessAddress;
    if (phone) retailer.phone = phone;
    if (logo) retailer.logo = logo;
    
    await retailer.save();
    
    // Return updated retailer without password
    const retailerResponse = retailer.toObject();
    delete retailerResponse.password;
    
    res.json(retailerResponse);
  } catch (error) {
    console.error('Error updating retailer profile:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, verifyRetailerToken };
