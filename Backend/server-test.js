const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const { router: retailerRoutes } = require('./routes/retailer');
const retailerProductRoutes = require('./routes/retailerProducts');
const retailerOrderRoutes = require('./routes/retailerOrders');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ?
    process.env.ALLOWED_ORIGINS.split(',') :
    ['http://localhost:5173', 'https://your-frontend-app-name.vercel.app', 'https://ip-ecommerce.vercel.app', 'https://tech-store-coral.vercel.app'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());

// Health check route
app.get('/', (_, res) => {
  res.json({
    message: 'E-commerce API is running (Backend/server-test.js)',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'ecommerce'
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Retailer routes
app.use('/api/retailer', retailerRoutes);
app.use('/api/retailer/products', retailerProductRoutes);
app.use('/api/retailer/orders', retailerOrderRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} (Backend/server-test.js)`);
});
