const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { verifyRetailerToken } = require('./retailer');

// Get all orders for the retailer's products
router.get('/', verifyRetailerToken, async (req, res) => {
  try {
    console.log('Fetching orders for retailer:', req.retailer._id);

    // Find all products by this retailer
    const retailerProducts = await Product.find({ retailer: req.retailer._id });
    console.log('Found retailer products:', retailerProducts.length);

    const productIds = retailerProducts.map(product => product._id);
    console.log('Product IDs:', productIds);

    // Convert product IDs to strings for easier comparison
    const productIdStrings = productIds.map(id => id.toString());
    console.log('Product ID strings:', productIdStrings);

    // Use a more direct approach to find orders
    // Get all users with orders
    const allUsers = await User.find({ 'orders.0': { $exists: true } });
    console.log('Found users with any orders:', allUsers.length);

    // For each user, log their orders and items
    for (const user of allUsers) {
      console.log(`User ${user.email} has ${user.orders.length} orders`);

      for (const order of user.orders) {
        console.log(`Order ${order._id} has ${order.items.length} items`);

        for (const item of order.items) {
          const itemProductId = item.product.toString();
          console.log(`Item product ID: ${itemProductId}, matches retailer product: ${productIdStrings.includes(itemProductId)}`);
        }
      }
    }

    // Populate the products after logging the raw IDs
    await User.populate(allUsers, {
      path: 'orders.items.product',
      populate: { path: 'retailer' }
    });

    // Then filter to users who have orders with this retailer's products
    const users = allUsers.filter(user => {
      return user.orders.some(order => {
        return order.items.some(item => {
          if (!item.product) return false;

          // Get the product ID as string
          const productId = item.product._id ? item.product._id.toString() : item.product.toString();

          // Check if this product belongs to the retailer
          const isRetailerProduct = productIdStrings.includes(productId);

          if (isRetailerProduct) {
            console.log(`Found matching product ${productId} in order ${order._id} for user ${user.email}`);
          }

          return isRetailerProduct;
        });
      });
    });

    console.log('Found users with orders from this retailer:', users.length);

    // Extract and format orders that contain the retailer's products
    const retailerOrders = [];

    users.forEach(user => {
      console.log(`Processing orders for user: ${user.email}, orders count: ${user.orders.length}`);
      user.orders.forEach(order => {
        // Check if any item in this order contains a product from this retailer
        const retailerItems = order.items.filter(item => {
          if (!item.product) return false;

          // Get the product ID in string format for consistent comparison
          let productId;
          if (typeof item.product === 'object' && item.product._id) {
            productId = item.product._id.toString();
          } else {
            productId = item.product.toString();
          }

          // Check if this product belongs to the retailer
          const isRetailerProduct = productIdStrings.includes(productId);

          if (isRetailerProduct) {
            console.log(`Found matching product ${productId} in order ${order._id}`);
          }

          return isRetailerProduct;
        });

        console.log(`Order ${order._id}: Found ${retailerItems.length} items from this retailer`);

        if (retailerItems.length > 0) {
          // Calculate subtotal for just this retailer's items
          const subtotal = retailerItems.reduce((sum, item) => {
            // Get the price safely, handling both populated and unpopulated products
            let price = 0;
            if (typeof item.product === 'object' && item.product.price) {
              price = item.product.price;
            }
            return sum + (price * item.quantity);
          }, 0);

          retailerOrders.push({
            orderId: order._id,
            orderDate: order.createdAt,
            customer: {
              name: user.name,
              email: user.email
            },
            items: retailerItems,
            shippingAddress: order.shippingAddress,
            status: order.status,
            subtotal: subtotal
          });
        }
      });
    });

    // Sort orders by date (newest first)
    retailerOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    console.log(`Returning ${retailerOrders.length} orders to retailer`);
    res.json(retailerOrders);
  } catch (error) {
    console.error('Error fetching retailer orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:orderId/status', verifyRetailerToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    // Validate status
    const validStatuses = ['PROCESSING', 'SHIPPED', 'DELIVERED'];
    const normalizedStatus = status.toUpperCase();

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        error: `Invalid status. Retailers can only set: ${validStatuses.join(', ')}`
      });
    }

    console.log(`Updating order status for order ${orderId}, user ${userEmail} to ${normalizedStatus}`);

    // Find the user with this order
    const user = await User.findOne({
      email: userEmail,
      'orders._id': orderId
    }).populate({
      path: 'orders.items.product',
      populate: { path: 'retailer' }
    });

    if (!user) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find the order
    const order = user.orders.id(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`Found order ${orderId} for user ${user.email}`);

    // Verify that this retailer has products in this order
    const retailerProducts = await Product.find({ retailer: req.retailer._id });
    const productIds = retailerProducts.map(product => product._id.toString());

    console.log(`Retailer has ${retailerProducts.length} products with IDs:`, productIds);
    console.log(`Order has ${order.items.length} items`);

    // Log each item in the order for debugging
    order.items.forEach((item, index) => {
      if (!item.product) {
        console.log(`Order item ${index}: Product reference is missing`);
        return;
      }

      // Get the product ID in string format for consistent comparison
      let productId;
      if (typeof item.product === 'object' && item.product._id) {
        productId = item.product._id.toString();
      } else {
        productId = item.product.toString();
      }

      const isRetailerProduct = productIds.includes(productId);
      console.log(`Order item ${index}: Product ID ${productId}, Is retailer product: ${isRetailerProduct}`);

      if (typeof item.product === 'object' && item.product.name) {
        console.log(`  Product details: ${item.product.name}, Retailer: ${item.product.retailer ? item.product.retailer._id : 'None'}`);
      }
    });

    // Check if any items in this order belong to this retailer
    const hasRetailerProducts = order.items.some(item => {
      if (!item.product) return false;

      // Get the product ID in string format
      let productId;
      if (typeof item.product === 'object' && item.product._id) {
        productId = item.product._id.toString();
      } else {
        productId = item.product.toString();
      }

      // Check if this product belongs to the retailer
      return productIds.includes(productId);
    });

    console.log(`Order ${hasRetailerProducts ? 'has' : 'does not have'} products from this retailer`);

    if (!hasRetailerProducts) {
      return res.status(403).json({
        error: 'You do not have permission to update this order'
      });
    }

    // Update order status
    order.status = normalizedStatus;
    await user.save();

    res.json({
      message: `Order status updated to ${normalizedStatus}`,
      orderId,
      status: normalizedStatus
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get order details
router.get('/:orderId', verifyRetailerToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`Fetching order details for order ${orderId}, user ${userEmail}`);

    // Find the user with this order
    const user = await User.findOne({
      email: userEmail,
      'orders._id': orderId
    }).populate({
      path: 'orders.items.product',
      populate: { path: 'retailer' }
    });

    if (!user) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find the order
    const order = user.orders.id(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`Found order ${orderId} for user ${user.email}`);

    // Verify that this retailer has products in this order
    const retailerProducts = await Product.find({ retailer: req.retailer._id });
    const productIds = retailerProducts.map(product => product._id.toString());

    console.log(`Retailer has ${retailerProducts.length} products with IDs:`, productIds);
    console.log(`Order has ${order.items.length} items`);

    // Log each item in the order for debugging
    order.items.forEach((item, index) => {
      if (!item.product) {
        console.log(`Order item ${index}: Product reference is missing`);
        return;
      }

      // Get the product ID in string format for consistent comparison
      let productId;
      if (typeof item.product === 'object' && item.product._id) {
        productId = item.product._id.toString();
      } else {
        productId = item.product.toString();
      }

      const isRetailerProduct = productIds.includes(productId);
      console.log(`Order item ${index}: Product ID ${productId}, Is retailer product: ${isRetailerProduct}`);

      if (typeof item.product === 'object' && item.product.name) {
        console.log(`  Product details: ${item.product.name}, Retailer: ${item.product.retailer ? item.product.retailer._id : 'None'}`);
      }
    });

    // Filter items to only include those from this retailer
    const retailerItems = order.items.filter(item => {
      if (!item.product) return false;

      // Get the product ID in string format
      let productId;
      if (typeof item.product === 'object' && item.product._id) {
        productId = item.product._id.toString();
      } else {
        productId = item.product.toString();
      }

      // Check if this product belongs to the retailer
      return productIds.includes(productId);
    });

    console.log(`Found ${retailerItems.length} items from this retailer in the order`);

    if (retailerItems.length === 0) {
      return res.status(403).json({
        error: 'You do not have permission to view this order'
      });
    }

    // Calculate subtotal for just this retailer's items
    const subtotal = retailerItems.reduce((sum, item) =>
      sum + (item.product.price * item.quantity), 0
    );

    const orderDetails = {
      orderId: order._id,
      orderDate: order.createdAt,
      customer: {
        name: user.name,
        email: user.email
      },
      items: retailerItems,
      shippingAddress: order.shippingAddress,
      status: order.status,
      subtotal: subtotal
    };

    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
