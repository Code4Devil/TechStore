import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UserSignup = () => {
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authMethod, setAuthMethod] = useState('email'); // 'email', 'phone', or 'gmail'
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/[^0-9]/g, ''));
  };

  const validateZipCode = (zipCode) => {
    const re = /^[0-9]{5}(-[0-9]{4})?$/;
    return re.test(zipCode);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Skip form submission for Gmail authentication as it's handled by the button
    if (authMethod === 'gmail') {
      return;
    }
    
    // Reset errors
    const newErrors = {};
    
    // Validate fields
    if (!name) newErrors.name = 'Name is required';
    
    if (authMethod === 'email') {
      if (!validateEmail(email)) newErrors.email = 'Valid email is required';
    }
    
    if (authMethod === 'phone') {
      if (!validatePhone(phone)) newErrors.phone = 'Valid 10-digit phone number is required';
    }
    
    // Skip other validations for Gmail as it will use OAuth
    
    if (!validateZipCode(zipCode)) newErrors.zipCode = 'Valid ZIP code is required';
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
    }
    
    // If there are errors, show them and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      // Use the appropriate registration method based on authMethod
      if (authMethod === 'email') {
        await register(name, email, password, { address, city, state, zipCode });
      } else if (authMethod === 'phone') {
        await register(name, phone, password, { address, city, state, zipCode }, 'phone');
      }
      // Gmail authentication is handled by the button click, not form submission
      
      toast.success('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    }
  };
  
  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };
  
  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };
  
  // Handle Google authentication
  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      toast.success('Google authentication successful');
    } catch (error) {
      toast.error(error.message || 'Google authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">Create Your Account</h2>
              
              {/* Auth Method Selector */}
              <div className="mb-6">
                <div className="flex space-x-4 bg-gray-100 p-1 rounded-lg">
                  <button 
                    type="button"
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${authMethod === 'email' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setAuthMethod('email')}
                  >
                    Email
                  </button>
                  <button 
                    type="button"
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${authMethod === 'phone' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setAuthMethod('phone')}
                  >
                    Phone
                  </button>
                  <button 
                    type="button"
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${authMethod === 'gmail' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setAuthMethod('gmail')}
                  >
                    Gmail
                  </button>
                </div>
              </div>
              
              {/* Gmail Authentication */}
              {authMethod === 'gmail' ? (
                <div className="text-center mb-4">
                  <p className="text-gray-700 text-sm mb-4">Sign up with your Google account</p>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#FFC107"/>
                      <path d="M2.543,7.151l3.75,2.775c1.002-2.402,3.301-4.076,5.964-4.076c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.991,2,4.171,4.086,2.543,7.151z" fill="#FF3D00"/>
                      <path d="M12.545,22c2.518,0,4.839-0.838,6.688-2.242l-3.097-2.622c-0.862,0.587-1.965,0.919-3.591,0.919c-2.797,0-5.168-1.892-6.013-4.442l-3.32,2.654C5.104,19.942,8.583,22,12.545,22z" fill="#4CAF50"/>
                      <path d="M22.971,12.193c0-0.791-0.089-1.602-0.252-2.378H12.545v3.821h5.445c-0.252,1.091-1.023,2.019-2.018,2.63l3.097,2.622C21.28,16.864,22.971,14.445,22.971,12.193z" fill="#1976D2"/>
                    </svg>
                    Continue with Google
                  </button>
                  
                  <div className="text-center mt-4">
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Already have an account? Sign in
                    </Link>
                  </div>
                </div>
              ) : (
                <form id="signup-form" className="space-y-4" onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  {/* Email authentication */}
                  {authMethod === 'email' && (
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={authMethod === 'email'}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  )}
                  
                  {/* Phone authentication */}
                  {authMethod === 'phone' && (
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="(123) 456-7890"
                        required={authMethod === 'phone'}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  )}
                  
                  {/* Address Fields */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="state">State</label>
                      <input
                        type="text"
                        id="state"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="12345"
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirm-password">Confirm Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg font-medium"
                  >
                    Create Account
                  </button>
                  
                  <div className="text-center mt-4">
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Already have an account? Sign in
                    </Link>
                  </div>
                </form>
              )}
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
};

export default UserSignup;
