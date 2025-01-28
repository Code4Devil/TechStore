import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useCart } from '../../Context/Cart';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCounts } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setLoading(false);
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/auth/profile?email=${email}`);
      if (!response.ok) throw new Error('Failed to fetch cart items');
      
      const data = await response.json();
      if (!data || !data.cart) {
        throw new Error('Cart data not found');
      }
      
      setCartItems(data.cart);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error('Please login first');
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/auth/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, quantity: newQuantity })
      });
  
      if (!response.ok) throw new Error('Failed to update quantity');
  
      setCartItems(cartItems.map(item => 
        item.product._id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };
  
  const handleRemoveItem = async (productId) => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error('Please login first');
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/auth/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
  
      if (!response.ok) throw new Error('Failed to remove item');
  
      setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + ((item.product.price || 0) * (item.quantity || 1)), 0);
    const shipping = cartItems.length > 0 ? 9.99 : 0;
    const tax = subtotal * 0.05;
    const total = subtotal +  tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const renderEmptyCart = () => (
    <div className="text-center py-16">
      <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h3>
      <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
      <Link 
        to="/" 
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="pt-24 md:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : cartItems.length === 0 ? (
              renderEmptyCart()
            ) : (
              cartItems.map((item) => (
                <div key={item.product._id} className="bg-white rounded-lg p-4 md:p-6 mb-4 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <i className={`fas ${item.product.image} text-3xl md:text-4xl text-gray-400`}></i>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.brand}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                      <p className="text-lg font-medium text-gray-900">
                        ${item.product.price?.toFixed(2)}
                      </p>

                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => handleQuantityChange(item.product._id, (item.quantity || 1) - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x min-w-[40px] text-center">
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.product._id, (item.quantity || 1) + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="text-lg font-semibold min-w-[80px] text-right">
                        ${((item.product.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                      
                      <button 
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="text-red-500 hover:text-red-700 ml-auto md:ml-0"
                        title="Remove item"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                 
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;