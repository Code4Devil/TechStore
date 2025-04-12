import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import config from '../config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${config.API_URL}/api/auth/profile?email=${email}`);
      if (!response.ok) throw new Error('Failed to fetch cart');

      const data = await response.json();
      if (data && data.cart) {
        setCartItems(data.cart);
        setCartCount(data.cart.reduce((total, item) => total + (item.quantity || 1), 0));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error('Please login first');
        return false;
      }

      const response = await fetch(`${config.API_URL}/api/auth/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, quantity })
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      const updatedCart = await response.json();
      setCartItems(updatedCart);
      setCartCount(updatedCart.reduce((total, item) => total + (item.quantity || 1), 0));
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error('Please login first');
        return false;
      }

      const response = await fetch(`${config.API_URL}/api/auth/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Failed to remove from cart');

      const updatedCart = await response.json();
      setCartItems(updatedCart);
      setCartCount(updatedCart.reduce((total, item) => total + (item.quantity || 1), 0));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error('Please login first');
        return false;
      }

      if (quantity < 1) {
        return removeFromCart(productId);
      }

      const response = await fetch(`${config.API_URL}/api/auth/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, quantity })
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      const updatedCart = await response.json();
      setCartItems(updatedCart);
      setCartCount(updatedCart.reduce((total, item) => total + (item.quantity || 1), 0));
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) return;

      const response = await fetch(`${config.API_URL}/api/auth/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Failed to clear cart');

      setCartItems([]);
      setCartCount(0);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    }
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;