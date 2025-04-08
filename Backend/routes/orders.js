const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { email, items, shippingAddress, totalAmount } = req.body;

    // Debug log
    console.log('Received order request:', { email, items, shippingAddress, totalAmount });
    console.log('Order items:', JSON.stringify(items));

    // Validate request body
    if (!email || !items || !shippingAddress || !totalAmount) {
      console.log('Missing fields:', { email, items, shippingAddress, totalAmount });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate products and update inventory
    const validatedItems = [];
    for (const item of items) {
      console.log(`Processing order item with product ID: ${item.product}`);

      // Populate the product with retailer information
      const product = await Product.findById(item.product).populate('retailer');
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }

      console.log(`Product ${product._id} (${product.name}) has retailer:`, product.retailer ? product.retailer._id : 'None');

      // Update product quantity
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          error: `Not enough inventory for ${product.name}. Available: ${product.quantity}`
        });
      }

      // Reduce product quantity
      product.quantity -= item.quantity;
      await product.save();

      // Store the product ID as a string to ensure consistent format
      const productId = product._id;
      console.log(`Adding product ${productId} to order`);

      validatedItems.push({
        product: productId,
        quantity: item.quantity
      });
    }

    // Convert status to uppercase
    const orderStatus = (req.body.status || 'PENDING').toUpperCase();
    console.log(`Creating order with status: ${orderStatus}`);

    const newOrder = {
      items: validatedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        phone: shippingAddress.phone
      },
      totalAmount,
      status: orderStatus,
      createdAt: new Date()
    };

    console.log('Creating new order:', JSON.stringify(newOrder, null, 2));

    // Add order to user's orders array
    user.orders.push(newOrder);

    // Clear user's cart
    user.cart = [];
    await user.save();

    // Populate product details in the response
    const populatedUser = await User.findById(user._id)
      .populate({
        path: 'orders.items.product',
        populate: { path: 'retailer' }
      })
      .select('orders');

    const createdOrder = populatedUser.orders[populatedUser.orders.length - 1];

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all orders for a user (query parameter version)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email })
      .populate({
        path: 'orders.items.product',
        populate: { path: 'retailer' }
      })
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

// Get all orders for a user (path parameter version)
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email })
      .populate({
        path: 'orders.items.product',
        populate: { path: 'retailer' }
      })
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

// Get specific order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email } = req.query;

    const user = await User.findOne({ email })
      .populate({
        path: 'orders.items.product',
        populate: { path: 'retailer' }
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = user.orders.id(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status (could be used by admin)
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email, status } = req.body;

    // Convert status to uppercase
    const normalizedStatus = status.toUpperCase();

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = user.orders.id(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = normalizedStatus;
    await user.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




