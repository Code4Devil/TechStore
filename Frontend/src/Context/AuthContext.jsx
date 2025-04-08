import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${config.API_URL}/api/auth/profile?email=${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('userEmail');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${config.API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('userEmail', data.email);
      setUser(data);
      toast.success('Login successful');
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${config.API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      toast.success('Registration successful');
      await login(email, password);
    } catch (error) {
      console.error('Error registering:', error);
      toast.error(error.message);
    }
  };

  const logout = () => {
    // First set loading to true to prevent any race conditions
    setLoading(true);

    // Clear local storage
    localStorage.removeItem('userEmail');

    // Reset user state
    setUser(null);

    // Show success message
    toast.success('Logged out successfully');

    // Set loading to false
    setLoading(false);

    // Navigate to login page
    navigate('/');
  };

  // Rename fetchProfile to checkAuthStatus for clarity and consistency
  const checkAuthStatus = fetchProfile;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;