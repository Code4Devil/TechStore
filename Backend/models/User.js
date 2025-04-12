const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required']
  },
  addressLine2: String,
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  }
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      message: '{VALUE} is not a valid status'
    },
    default: 'PENDING',
    uppercase: true, // Change from lowercase to uppercase
    set: v => v.toUpperCase() // Change from toLowerCase to toUpperCase
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update the pre-save middleware to ensure status is uppercase
orderSchema.pre('save', function(next) {
  if (this.status) {
    this.status = this.status.toUpperCase();
  }
  next();
});

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  orders: [orderSchema]
}, {
  timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password verification method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
