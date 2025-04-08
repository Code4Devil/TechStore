import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Failed to log in');
    }
  };

  return (
    <div className=''>
      <div className="p-6 h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg transition-all duration-500 transform hover:scale-[1.01]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-2px">
            <div className='mb-4'>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 shadow-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 shadow-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className='text-center space-y-4'>
          <div>
            <Link to='/signup' className="text-indigo-600 hover:text-indigo-800">Don't have an account? Create one</Link>
          </div>
          <div className="border-t pt-4">
            <Link to='/retailer/login' className="text-gray-600 hover:text-gray-800 flex items-center justify-center">
              <span className="mr-2">Are you a seller?</span>
              <span className="font-medium text-indigo-600 hover:text-indigo-800">Retailer Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;