const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to your existing database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'ecommerce'  // Make sure this matches your database name
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const generateProducts = () => {
  const products = [];

  // Sample product data with required fields from your Product model
  const sampleProducts = [
    {
      name: 'iPhone 13 Pro',
      description: 'Latest iPhone with pro camera system',
      price: 999.99,
      originalPrice: 1099.99,
      brand: 'Apple',
      category: 'Phones',
      image: 'iphone13pro.jpg',
      rating: 4.8,
      reviews: 245,
      tags: ['New', 'Featured'],
      quantity: 50,
      type: 'phone'
    },
    {
      name: 'Samsung Galaxy Tab S7',
      description: 'Premium Android tablet',
      price: 649.99,
      originalPrice: 749.99,
      brand: 'Samsung',
      category: 'Tablets',
      image: 'galaxytabs7.jpg',
      rating: 4.6,
      reviews: 189,
      tags: ['Popular'],
      quantity: 30,
      type: 'tablet'
    },
    {
      name: 'MacBook Pro 14"',
      description: 'Powerful laptop for professionals',
      price: 1999.99,
      originalPrice: 2199.99,
      brand: 'Apple',
      category: 'Laptops',
      image: 'macbookpro14.jpg',
      rating: 4.9,
      reviews: 312,
      tags: ['Premium'],
      quantity: 25,
      type: 'laptop'
    }
  ];

  // Add more variations of each product
  sampleProducts.forEach(baseProduct => {
    for (let i = 1; i <= 5; i++) {
      products.push({
        ...baseProduct,
        name: `${baseProduct.name} - Version ${i}`,
        price: baseProduct.price * (1 + (Math.random() * 0.2 - 0.1)), // ±10% price variation
        quantity: Math.floor(Math.random() * 50) + 10
      });
    }
  });

  return products;
};

const insertProducts = async () => {
  try {
    console.log('Starting product insertion...');
    
    // Generate products
    const products = generateProducts();
    console.log(`Generated ${products.length} products`);

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    // Log some sample data
    console.log('\nSample products inserted:');
    console.log(insertedProducts.slice(0, 3));

  } catch (error) {
    console.error('Error inserting products:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// Run the insertion
insertProducts();