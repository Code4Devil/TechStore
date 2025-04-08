import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRetailer } from '../../Context/RetailerContext';
import RetailerNav from '../../Components/RetailerNav';
import { toast } from 'react-toastify';
import { getProductIconByType, getIconColorByType } from '../../utils/productIcons';

const OrderList = () => {
  const { token } = useRetailer();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (token) {
      fetchOrders();

      // Check for filter in URL query params
      const searchParams = new URLSearchParams(location.search);
      const filterParam = searchParams.get('filter');
      if (filterParam) {
        setFilter(filterParam);
      }
    }
  }, [token, location.search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching retailer orders with token:', token ? 'Token exists' : 'No token');

      const response = await fetch('http://localhost:5000/api/retailer/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Received ${data.length} orders from server`);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(`Failed to fetch orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    // Skip orders with missing customer information
    if (!order.customer || !order.customer.name || !order.customer.email) {
      console.warn('Order with missing customer information:', order);
      return false;
    }

    const matchesSearch =
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.orderId && order.orderId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filter === 'all') return matchesSearch;
    return matchesSearch && order.status === filter;
  });

  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) =>
    new Date(b.orderDate) - new Date(a.orderDate)
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by customer name, email, or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('PROCESSING')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'PROCESSING'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setFilter('SHIPPED')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'SHIPPED'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => setFilter('DELIVERED')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'DELIVERED'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => setFilter('CANCELLED')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'CANCELLED'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {sortedOrders.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? `No orders matching "${searchQuery}"`
                : filter !== 'all'
                ? `No ${filter.toLowerCase()} orders found`
                : 'You have no orders yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderId.slice(-6)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                        ${order.subtotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                        <Link to={`/retailer/orders/${order.orderId}?email=${encodeURIComponent(order.customer.email)}`} className="text-indigo-600 hover:text-indigo-900">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
