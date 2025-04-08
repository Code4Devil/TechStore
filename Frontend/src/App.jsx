import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from './Context/Cart';
import { ProductProvider } from './Context/ProductContext';
import { SearchProvider } from './Context/SearchContext';
import { RetailerProvider } from './Context/RetailerContext';
import LoginPage from './Pages/User/LoginPage';
import UserSignup from './Pages/User/UserSignup';
import MainPage from './Pages/MainPage';
import Laptops from './Pages/user/Laptops';
import Phones from './Pages/user/Phones';
import Tablets from './Pages/user/Tablets';
import Accessories from './Pages/user/Accessories';
import AllProducts from './Pages/User/AllProducts';
import CartPage from './Pages/user/CartPage';
import SearchResults from './Pages/SearchResults';
import ProductPage from './Pages/ProductPage';
import { useAuth } from './Context/AuthContext';
import { useRetailer } from './Context/RetailerContext';
import {useEffect} from 'react';
import ProfilePage from './Pages/User/ProfilePage';

// Retailer pages
import RetailerLogin from './Pages/Retailer/RetailerLogin';
import RetailerRegister from './Pages/Retailer/RetailerRegister';
import RetailerDashboard from './Pages/Retailer/RetailerDashboard';
import ProductList from './Pages/Retailer/ProductList';
import ProductForm from './Pages/Retailer/ProductForm';
import OrderList from './Pages/Retailer/OrderList';
import OrderDetail from './Pages/Retailer/OrderDetail';

const App = () => {

  const ProtectedRoute = ({ children }) => {
    const { user, loading, checkAuthStatus } = useAuth();

    useEffect(() => {
      if (!user && !loading) {
        checkAuthStatus();
      }
    }, [user, loading]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!user && !loading) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  // Protected route for retailers
  const RetailerProtectedRoute = ({ children }) => {
    const { retailer, loading } = useRetailer();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!retailer && !loading) {
      return <Navigate to="/retailer/login" replace />;
    }

    return children;
  };

  return (
    <AuthProvider>
      <RetailerProvider>
        <ProductProvider>
          <CartProvider>
            <SearchProvider>
              <div className='overflow-x-hidden'>
                <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<UserSignup />} />
                {/* Protected Routes */}
                <Route path="/home" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
                <Route path="/laptops" element={<ProtectedRoute><Laptops /></ProtectedRoute>} />
                <Route path="/phones" element={<ProtectedRoute><Phones /></ProtectedRoute>} />
                <Route path="/tablets" element={<ProtectedRoute><Tablets /></ProtectedRoute>} />
                <Route path="/accessories" element={<ProtectedRoute><Accessories /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><AllProducts /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
                <Route path="/product/:id" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                  {/* Retailer Routes */}
                  <Route path="/retailer/login" element={<RetailerLogin />} />
                  <Route path="/retailer/register" element={<RetailerRegister />} />
                  <Route path="/retailer/dashboard" element={<RetailerProtectedRoute><RetailerDashboard /></RetailerProtectedRoute>} />
                  <Route path="/retailer/products" element={<RetailerProtectedRoute><ProductList /></RetailerProtectedRoute>} />
                  <Route path="/retailer/products/new" element={<RetailerProtectedRoute><ProductForm /></RetailerProtectedRoute>} />
                  <Route path="/retailer/products/:productId" element={<RetailerProtectedRoute><ProductForm /></RetailerProtectedRoute>} />
                  <Route path="/retailer/orders" element={<RetailerProtectedRoute><OrderList /></RetailerProtectedRoute>} />
                  <Route path="/retailer/orders/:orderId" element={<RetailerProtectedRoute><OrderDetail /></RetailerProtectedRoute>} />
                </Routes>
              </div>
            </SearchProvider>
          </CartProvider>
        </ProductProvider>
      </RetailerProvider>
    </AuthProvider>
  );
};

// Add ProtectedRoute component


export default App;
