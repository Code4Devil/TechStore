import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UserSignup = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState({
    name: false,
    email: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
    password: false,
    confirmPassword: false
  });

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  // Phone validation removed

  const validateZipCode = (zipCode) => {
    // Support Indian PIN codes (6 digits) and US ZIP codes (5 digits with optional 4-digit extension)
    const re = /^[0-9]{6}$|^[0-9]{5}(-[0-9]{4})?$/;
    return re.test(zipCode);
  };

  const validateAddress = (address) => {
    return address.trim().length > 0;
  };

  const validateCity = (city) => {
    return city.trim().length > 0;
  };

  const validateState = (state) => {
    return state.trim().length > 0;
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  // Validate form field when it loses focus
  const handleBlur = (field) => {
    setFormTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  // Validate a specific field
  const validateField = (field) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!name) newErrors.name = 'Name is required';
        else delete newErrors.name;
        break;
      case 'email':
        if (!validateEmail(email)) newErrors.email = 'Valid email is required';
        else delete newErrors.email;
        break;
      case 'address':
        if (!validateAddress(address)) newErrors.address = 'Address is required';
        else delete newErrors.address;
        break;
      case 'city':
        if (!validateCity(city)) newErrors.city = 'City is required';
        else delete newErrors.city;
        break;
      case 'state':
        if (!validateState(state)) newErrors.state = 'State is required';
        else delete newErrors.state;
        break;
      case 'zipCode':
        if (!validateZipCode(zipCode)) newErrors.zipCode = 'Valid ZIP code is required';
        else delete newErrors.zipCode;
        break;
      case 'password':
        if (!validatePassword(password)) {
          newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        } else {
          delete newErrors.password;
        }
        // Also validate confirm password if it's been touched
        if (formTouched.confirmPassword && password !== confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (formTouched.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (password !== confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = 'Name is required';
    if (!validateEmail(email)) newErrors.email = 'Valid email is required';
    if (!validateAddress(address)) newErrors.address = 'Address is required';
    if (!validateCity(city)) newErrors.city = 'City is required';
    if (!validateState(state)) newErrors.state = 'State is required';
    if (!validateZipCode(zipCode)) newErrors.zipCode = 'Valid ZIP code is required';
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formTouched).forEach(key => { allTouched[key] = true });
    setFormTouched(allTouched);

    // Validate all fields
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      // Register with email
      await register(name, email, password, { address, city, state, zipCode });

      toast.success('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Phone formatting removed

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">Create Your Account</h2>



              <form id="signup-form" className="space-y-4" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name && formTouched.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formTouched.name) validateField('name');
                    }}
                    onBlur={() => handleBlur('name')}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email && formTouched.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formTouched.email) validateField('email');
                    }}
                    onBlur={() => handleBlur('email')}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Address Fields */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.address && formTouched.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (formTouched.address) validateField('address');
                    }}
                    onBlur={() => handleBlur('address')}
                    required
                  />
                  {errors.address && formTouched.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.city && formTouched.city ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (formTouched.city) validateField('city');
                      }}
                      onBlur={() => handleBlur('city')}
                      required
                    />
                    {errors.city && formTouched.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.state && formTouched.state ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        if (formTouched.state) validateField('state');
                      }}
                      onBlur={() => handleBlur('state')}
                      required
                    />
                    {errors.state && formTouched.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.zipCode && formTouched.zipCode ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                    value={zipCode}
                    onChange={(e) => {
                      setZipCode(e.target.value);
                      if (formTouched.zipCode) validateField('zipCode');
                    }}
                    onBlur={() => handleBlur('zipCode')}
                    placeholder="140413"
                    required
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                </div>

                {/* Password Fields */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.password && formTouched.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formTouched.password) validateField('password');
                      if (formTouched.confirmPassword && confirmPassword) validateField('confirmPassword');
                    }}
                    onBlur={() => handleBlur('password')}
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirm-password">Confirm Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword && formTouched.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formTouched.confirmPassword) validateField('confirmPassword');
                    }}
                    onBlur={() => handleBlur('confirmPassword')}
                    required
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    required
                  />
                  <label className="ml-2 text-gray-700 text-sm" htmlFor="terms">I agree to the Terms and Conditions</label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg font-medium ${(isSubmitting || Object.keys(errors).length > 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="text-center mt-4">
                  <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Already have an account? Sign in
                  </Link>
                </div>
              </form>
            </div>
            <div className="md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-6">Welcome to TechStore</h3>
                <p className="text-indigo-100 mb-8">Join our community of tech enthusiasts and enjoy exclusive benefits.</p>

                <ul className="text-white space-y-6">
                  <li className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Exclusive Deals</h4>
                      <p className="text-indigo-100 text-sm">Get access to member-only discounts</p>
                    </div>
                  </li>

                  <li className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Easy Order Tracking</h4>
                      <p className="text-indigo-100 text-sm">Monitor your orders in real-time</p>
                    </div>
                  </li>

                  <li className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Secure Checkout</h4>
                      <p className="text-indigo-100 text-sm">Your data is always protected</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;