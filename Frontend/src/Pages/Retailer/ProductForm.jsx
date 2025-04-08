import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRetailer } from '../../Context/RetailerContext';
import RetailerNav from '../../Components/RetailerNav';
import { toast } from 'react-toastify';
import { getProductIconByType, getIconColorByType } from '../../utils/productIcons';

const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { token } = useRetailer();
  const isEditMode = !!productId;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    brand: '',
    image: '',
    tags: '',
    quantity: '',
    type: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && token) {
      fetchProduct();
    }
  }, [productId, token]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/retailer/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const product = await response.json();

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        brand: product.brand || '',
        image: product.image || '',
        tags: product.tags ? product.tags.join(', ') : '',
        quantity: product.quantity || '',
        type: product.type || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product details');
      navigate('/retailer/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.originalPrice && (isNaN(formData.originalPrice) || Number(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = 'Original price must be a positive number';
    }

    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    else if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative number';
    }

    if (!formData.type.trim()) newErrors.type = 'Product type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Process tags from comma-separated string to array
      const processedData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        quantity: Number(formData.quantity),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const url = isEditMode
        ? `http://localhost:5000/api/retailer/products/${productId}`
        : 'http://localhost:5000/api/retailer/products';

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(processedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully`);
      navigate('/retailer/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setSubmitting(false);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? 'Update your product information'
              : 'Fill in the details to add a new product to your inventory'}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Product Name */}
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.name ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of your product
                </p>
              </div>

              {/* Price */}
              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($) *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                      errors.price ? 'border-red-300' : ''
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
              </div>

              {/* Original Price */}
              <div className="sm:col-span-2">
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                  Original Price ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="originalPrice"
                    id="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                      errors.originalPrice ? 'border-red-300' : ''
                    }`}
                    placeholder="0.00"
                  />
                  {errors.originalPrice && <p className="mt-1 text-sm text-red-600">{errors.originalPrice}</p>}
                </div>
              </div>

              {/* Quantity */}
              <div className="sm:col-span-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="quantity"
                    id="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.quantity ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                </div>
              </div>

              {/* Brand */}
              <div className="sm:col-span-3">
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Product Type *
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.type ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select a type</option>
                    <option value="phone">Phone</option>
                    <option value="laptop">Laptop</option>
                    <option value="tablet">Tablet</option>
                    <option value="headphones">Headphones</option>
                    <option value="camera">Camera</option>
                    <option value="tv">TV/Monitor</option>
                    <option value="speaker">Speaker</option>
                    <option value="gaming">Gaming</option>
                    <option value="keyboard">Keyboard</option>
                    <option value="mouse">Mouse</option>
                    <option value="storage">Storage</option>
                    <option value="accessory">Accessory</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                  {formData.type && (
                    <div className="mt-2 flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Category icon:</span>
                      <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                        <i className={`${getProductIconByType(formData.type)} ${getIconColorByType(formData.type)}`}></i>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Image URL */}
              <div className="sm:col-span-6">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="image"
                    id="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="mt-2 flex items-center">
                  <p className="text-sm text-gray-500 mr-3">
                    Enter a URL for the product image
                  </p>
                  {formData.type && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Fallback icon:</span>
                      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                        <i className={`${getProductIconByType(formData.type)} ${getIconColorByType(formData.type)}`}></i>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="sm:col-span-6">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Comma-separated list of tags (e.g., "new, featured, sale")
                </p>
              </div>

              {/* Active Status */}
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isActive" className="font-medium text-gray-700">
                      Active
                    </label>
                    <p className="text-gray-500">
                      Product will be visible to customers when active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/retailer/products')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    submitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
