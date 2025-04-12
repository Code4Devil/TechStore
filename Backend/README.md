# E-commerce Backend

This is the backend API for the e-commerce application.

## Deployment on Render

### Prerequisites

- A Render account
- MongoDB Atlas database

### Steps to Deploy

1. Push your code to a GitHub repository
2. Log in to your Render account
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure the service:
   - Name: ecommerce-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server-test.js`
   - Root Directory: `.` (or leave blank)

6. Add environment variables:
   - MONGO_URI: Your MongoDB connection string
   - JWT_SECRET: Your JWT secret key
   - PORT: 10000 (or any port Render assigns)

7. Deploy the service

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables
4. Run the development server: `npm run dev`

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth/profile - Get user profile

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get a specific product

### Orders
- GET /api/orders - Get all orders
- POST /api/orders - Create a new order
- GET /api/orders/:id - Get a specific order

### Retailer
- POST /api/retailer/login - Login a retailer
- POST /api/retailer/register - Register a new retailer
- GET /api/retailer/products - Get retailer products
- POST /api/retailer/products - Add a new product
- PUT /api/retailer/products/:id - Update a product
- DELETE /api/retailer/products/:id - Delete a product
- GET /api/retailer/orders - Get retailer orders
- PUT /api/retailer/orders/:id - Update order status
