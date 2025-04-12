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
  origin: function(origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS ?
      process.env.ALLOWED_ORIGINS.split(',') :
      ['http://localhost:5173', 'https://your-frontend-app-name.vercel.app', 'https://ip-ecommerce.vercel.app', 'https://tech-store-coral.vercel.app', 'https://tech-store-71crwvvni-code4devils-projects.vercel.app', 'https://tech-store-coral-vercel.app'];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Temporarily allow all origins for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add preflight OPTIONS handling for all routes
app.options('*', cors());

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

// Add CORS headers to all responses
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
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
