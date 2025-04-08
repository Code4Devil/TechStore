import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useRetailer } from '../../Context/RetailerContext';
import RetailerNav from '../../Components/RetailerNav';
import { toast } from 'react-toastify';
import { getProductIconByType, getIconColorByType } from '../../utils/productIcons';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useRetailer();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, status: '' });

  // Get email from query params
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email) {
      fetchOrderDetails();
    } else if (!email) {
      toast.error('Customer email is required');
      navigate('/retailer/orders');
    }
  }, [token, orderId, email]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      console.log(`Fetching order details for order ${orderId}, user ${email}`);

      const response = await fetch(`http://localhost:5000/api/retailer/orders/${orderId}?userEmail=${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to fetch order details: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received order details:', data);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error(`Failed to fetch order details: ${error.message}`);
      navigate('/retailer/orders');
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = (status) => {
    setConfirmDialog({ open: true, status });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, status: '' });
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      closeConfirmDialog();

      console.log(`Updating order ${orderId} status to ${newStatus}`);

      const response = await fetch(`http://localhost:5000/api/retailer/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          userEmail: email
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);

        let errorMessage = 'Failed to update order status';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If the error text is not valid JSON, use the raw text
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Update local state
      setOrder({
        ...order,
        status: newStatus
      });

      console.log(`Successfully updated order status to ${newStatus}`);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RetailerNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/retailer/orders')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetailerNav />

      {/* Status Update Confirmation Dialog */}
      {confirmDialog.open && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeConfirmDialog}></div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Update Order Status
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to update this order's status to <span className="font-medium">{confirmDialog.status}</span>?
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  onClick={() => updateOrderStatus(confirmDialog.status)}
                  disabled={updatingStatus}
                >
                  {updatingStatus ? 'Updating...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={closeConfirmDialog}
                  disabled={updatingStatus}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Order #{order.orderId.slice(-6)}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
              {order.status}
            </span>
            <button
              onClick={() => navigate('/retailer/orders')}
              className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Orders
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Order Details */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.orderId}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(order.orderDate).toLocaleString()}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.customer.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Customer Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.customer.email}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <address className="not-italic">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.addressLine1}<br />
                      {order.shippingAddress.addressLine2 && (
                        <>{order.shippingAddress.addressLine2}<br /></>
                      )}
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      Phone: {order.shippingAddress.phone}
                    </address>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Order Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>

                      {/* Status update dropdown */}
                      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <div className="ml-4">
                          <label htmlFor="status" className="sr-only">Update status</label>
                          <div className="flex items-center">
                            <select
                              id="status"
                              name="status"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              defaultValue=""
                              disabled={updatingStatus}
                              onChange={(e) => {
                                if (e.target.value) {
                                  openConfirmDialog(e.target.value);
                                  e.target.value = ""; // Reset after selection
                                }
                              }}
                            >
                              <option value="" disabled>Update status</option>
                              {order.status === 'PENDING' && (
                                <option value="PROCESSING">Mark as Processing</option>
                              )}
                              {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                                <option value="SHIPPED">Mark as Shipped</option>
                              )}
                              {(order.status === 'PENDING' || order.status === 'PROCESSING' || order.status === 'SHIPPED') && (
                                <option value="DELIVERED">Mark as Delivered</option>
                              )}
                            </select>
                            {updatingStatus && (
                              <svg className="animate-spin ml-2 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-sm font-medium text-gray-500">Items</h3>
                <div className="mt-2 divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-4 flex">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                        {item.product ? (
                          item.product.image ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={item.product.image}
                              alt={item.product.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                // Add icon element after the image
                                const iconElement = document.createElement('i');
                                const iconClass = getProductIconByType(item.product.type);
                                const colorClass = getIconColorByType(item.product.type);
                                iconElement.className = `${iconClass} ${colorClass}`;
                                e.target.parentNode.appendChild(iconElement);
                              }}
                            />
                          ) : (
                            <i className={`${getProductIconByType(item.product.type || 'other')} ${getIconColorByType(item.product.type || 'other')}`}></i>
                          )
                        ) : (
                          <i className="fas fa-box text-gray-400"></i>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{item.product ? item.product.name : 'Product Unavailable'}</h4>
                            <p className="text-sm text-gray-500">{item.product ? item.product.brand : ''}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${item.product ? (item.product.price * item.quantity).toFixed(2) : '0.00'}
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-500">${item.product ? item.product.price.toFixed(2) : '0.00'} each</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-900">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">${order.subtotal.toFixed(2)}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
