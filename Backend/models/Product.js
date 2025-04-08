const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: {
    type: String,
    default: ''
  },
  originalPrice: Number,
  rating: Number,
  reviews: Number,
  image: String,
  tags: [String],
  brand: String,
  liked: { type: Boolean, default: false },
  inCart: { type: Boolean, default: false },
  cartQuantity: { type: Number, default: 0 },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  type: String, // phone, laptop, tablet, etc.
  retailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
