const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      cart: [],
      wishlist: []
    });
    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login route
// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user and populate cart and wishlist
    const user = await User.findOne({ email })
      .populate('cart.product')
      .populate('wishlist');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ user: userResponse, email: userResponse.email });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email })
      .populate('cart.product')
      .select('-password'); // Exclude password
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cart routes
router.put('/cart', async (req, res) => {
  const { email, productId, quantity } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/cart/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { email, quantity = 1 } = req.body;

    console.log('Adding to cart:', { productId, email, quantity }); // Debug log

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cartItemIndex = user.cart.findIndex(
      item => item.product?.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate('cart.product');
    
    console.log('Updated cart:', user.cart); // Debug log
    res.json(user.cart);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/cart/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();

    res.json(user.cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add this route to get user orders
router.get('/orders', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email })
      .populate('orders.items.product')
      .select('orders');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
router.post('/orders', async (req, res) => {
  try {
    const { email, items, shippingAddress, totalAmount, status } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = {
      items,
      shippingAddress,
      totalAmount,
      status,
      createdAt: new Date()
    };

    user.orders = user.orders || [];
    user.orders.push(order);
    await user.save();

    // Clear the user's cart
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
