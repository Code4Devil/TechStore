import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRetailer } from '../../Context/RetailerContext';
import { toast } from 'react-toastify';

const RetailerRegister = () => {
  const { register } = useRetailer();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.businessAddress.street) newErrors['businessAddress.street'] = 'Street address is required';
    if (!formData.businessAddress.city) newErrors['businessAddress.city'] = 'City is required';
    if (!formData.businessAddress.state) newErrors['businessAddress.state'] = 'State is required';
    if (!formData.businessAddress.zipCode) newErrors['businessAddress.zipCode'] = 'ZIP code is required';
    if (!formData.businessAddress.country) newErrors['businessAddress.country'] = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...retailerData } = formData;
        await register(retailerData);
      } catch (error) {
        toast.error('Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Create a Retailer Account
          </h2>
          <p className="mt-2 text-gray-600">
            Join our marketplace and start selling your products
          </p>
        </div>

        <div className="mt-6 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
              {/* Personal Information */}
              <div className="sm:col-span-2">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Business Information */}
              <div className="sm:col-span-2 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="businessName"
                    id="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Business Phone
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              {/* Business Address */}
              <div className="sm:col-span-2 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Business Address</h3>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="businessAddress.street" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="businessAddress.street"
                    id="businessAddress.street"
                    value={formData.businessAddress.street}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors['businessAddress.street'] && <p className="mt-1 text-sm text-red-600">{errors['businessAddress.street']}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="businessAddress.city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="businessAddress.city"
                    id="businessAddress.city"
                    value={formData.businessAddress.city}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors['businessAddress.city'] && <p className="mt-1 text-sm text-red-600">{errors['businessAddress.city']}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="businessAddress.state" className="block text-sm font-medium text-gray-700">
                  State / Province
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="businessAddress.state"
                    id="businessAddress.state"
                    value={formData.businessAddress.state}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors['businessAddress.state'] && <p className="mt-1 text-sm text-red-600">{errors['businessAddress.state']}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="businessAddress.zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP / Postal Code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="businessAddress.zipCode"
                    id="businessAddress.zipCode"
                    value={formData.businessAddress.zipCode}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors['businessAddress.zipCode'] && <p className="mt-1 text-sm text-red-600">{errors['businessAddress.zipCode']}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="businessAddress.country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="businessAddress.country"
                    id="businessAddress.country"
                    value={formData.businessAddress.country}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors['businessAddress.country'] && <p className="mt-1 text-sm text-red-600">{errors['businessAddress.country']}</p>}
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Link
                  to="/retailer/login"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RetailerRegister;
