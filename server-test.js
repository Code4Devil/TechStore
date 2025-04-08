const express = require('express');
const app = express();

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce API test server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
