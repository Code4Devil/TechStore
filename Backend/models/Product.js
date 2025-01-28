const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  
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
  
  type: String // Add the type field
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
