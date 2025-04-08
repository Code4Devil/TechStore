# E-commerce Application Deployment Guide

This guide explains how to deploy the e-commerce application with the frontend on Vercel and the backend on Render.

## Frontend Deployment (Vercel)

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)

2. **Install Vercel CLI (Optional)**
   ```bash
   npm install -g vercel
   ```

3. **Deploy from GitHub**
   - Connect your GitHub repository to Vercel
   - Select the Frontend directory as the root directory
   - Set the following environment variables:
     - `VITE_API_URL`: Your backend URL (e.g., https://your-backend-app-name.onrender.com)

4. **Manual Deployment**
   - Navigate to the Frontend directory
   - Run:
   ```bash
   vercel login
   vercel
   ```

## Backend Deployment (Render)

1. **Create a Render Account**
   - Sign up at [render.com](https://render.com)

2. **Deploy from GitHub**
   - Connect your GitHub repository to Render
   - Create a new Web Service
   - Select the Backend directory as the root directory
   - Set the following environment variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `PORT`: 10000 (or any port Render assigns)

3. **Configure CORS**
   - After deployment, update the CORS settings in `server.js` with your actual Vercel frontend URL

## Post-Deployment Steps

1. **Update Frontend Configuration**
   - Update the `.env.production` file with your actual backend URL
   - Redeploy the frontend if necessary

2. **Test the Application**
   - Test user authentication
   - Test product browsing and ordering
   - Test retailer functionality

## Troubleshooting

- **CORS Issues**: Ensure the backend CORS settings include your frontend URL
- **Connection Issues**: Check environment variables and network settings
- **Database Issues**: Verify MongoDB connection string and network access
