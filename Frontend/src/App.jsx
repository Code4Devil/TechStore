import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Route, Routes } from 'react-router-dom';
import Mainpage from './Pages/Mainpage';
import UserSignup from './Pages/User/UserSignup';
import Laptops from './Pages/User/Laptops';
import Phones from './Pages/User/Phones';
import Tablets from './Pages/User/Tablets';
import Accessories from './Pages/User/Accessories';
import AllProducts from './Pages/User/AllProducts';
import CartPage from './Pages/User/CartPage';
import SearchResults from './Pages/SearchResults';
import ProductPage from './Pages/ProductPage';
import { AuthProvider } from './Context/AuthContext';
import LoginPage from './Pages/User/LoginPage';

const App = () => {
  return (
    <AuthProvider>
      <div className='overflow-x-hidden' >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/home" element={<Mainpage />} />
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/phones" element={<Phones />} />
          <Route path="/tablets" element={<Tablets />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;