// Using CommonJS modules to maintain compatibility with the rest of the project
// The IDE may suggest converting to ES modules, but we're keeping CommonJS for consistency
/** @type {import('module')} */
const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Valid order statuses according to the schema
const VALID_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

async function fixOrderStatuses() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');

    // Find users who have orders
    console.log('Finding users with orders...');
    const users = await User.find({ 'orders.0': { $exists: true } });
    console.log(`Found ${users.length} users with orders`);
    let totalFixed = 0;

    for (const user of users) {
      let hasChanges = false;

      user.orders.forEach(order => {
        // Skip if order doesn't have a status
        if (!order.status) {
          order.status = 'PENDING';
          hasChanges = true;
          totalFixed++;
          return;
        }

        const oldStatus = order.status;
        // Convert status to uppercase and normalize
        let newStatus = oldStatus.toUpperCase();

        // Map any non-standard status values
        if (!VALID_STATUSES.includes(newStatus)) {
          // Handle specific non-standard statuses
          switch (newStatus) {
            case 'IN TRANSIT':
              newStatus = 'SHIPPED';
              break;
            case 'ORDERED':
              newStatus = 'PENDING';
              break;
            default:
              console.log(`Converting invalid status '${newStatus}' to 'PENDING' for order ${order._id}`);
              newStatus = 'PENDING';
              break;
          }
        }

        if (oldStatus !== newStatus) {
          order.status = newStatus;
          hasChanges = true;
          totalFixed++;
        }
      });

      if (hasChanges) {
        try {
          await user.save();
          console.log(`Updated orders for user ${user.email}`);
        } catch (saveError) {
          console.error(`Error saving user ${user.email}:`, saveError);
        }
      }
    }

    console.log(`Fixed ${totalFixed} order statuses successfully`);
  } catch (error) {
    console.error('Error fixing order statuses:', error);
    process.exit(1);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('Database connection closed');
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
}

fixOrderStatuses();

