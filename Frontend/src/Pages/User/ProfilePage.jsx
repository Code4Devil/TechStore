import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import config from '../../config';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'past'
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Add event listener for Escape key to close the logout confirmation modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && showLogoutConfirm) {
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showLogoutConfirm]);

  const fetchOrders = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${config.API_URL}/api/orders?email=${email}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatus = (status) => {
    // Ensure status is uppercase for consistency
    const upperStatus = status.toUpperCase();

    const statusColors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };

    // Default to pending style if status is not recognized
    const colorClass = statusColors[upperStatus] || statusColors['PENDING'];
    return `${colorClass} px-3 py-1 rounded-full text-sm font-medium`;
  };

  const renderOrderCard = (order) => (
    <div key={order._id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
          <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={getOrderStatus(order.status)}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
        </span>
      </div>

      <div className="space-y-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <i className={`fas ${item.product.image} text-2xl text-gray-600`}></i>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{item.product.name}</h4>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">${item.product.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium mb-2">Track Your Order</h4>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{
                    width: order.status === 'PENDING' ? '25%' :
                           order.status === 'PROCESSING' ? '50%' :
                           order.status === 'SHIPPED' ? '75%' : '100%'
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Order Placed</span>
                <span>Processing</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-user text-2xl text-blue-600"></i>
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xl md:text-2xl font-bold truncate">{user?.name}</h2>
                <p className="text-gray-600 text-sm md:text-base truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setShowLogoutConfirm(false)}
              >
                <div
                  className="bg-white rounded-lg p-4 sm:p-6 max-w-sm mx-4 sm:mx-auto w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-bold">Confirm Logout</h3>
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      <i className="fas fa-times text-lg"></i>
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Are you sure you want to log out of your account?</p>
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md order-2 sm:order-1 w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowLogoutConfirm(false);
                        logout();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg order-1 sm:order-2 w-full sm:w-auto"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'current'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Current Orders
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past Orders
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-medium text-gray-600">No orders found</h3>
              <p className="text-gray-500">You haven't placed any orders yet.</p>
            </div>
          ) : (
            orders
              .filter(order =>
                activeTab === 'current'
                  ? ['PENDING', 'PROCESSING', 'SHIPPED'].includes(order.status)
                  : ['DELIVERED', 'CANCELLED'].includes(order.status)
              )
              .map(order => renderOrderCard(order))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
