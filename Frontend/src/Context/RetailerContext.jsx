import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../config';

const RetailerContext = createContext();

export const useRetailer = () => useContext(RetailerContext);

export const RetailerProvider = ({ children }) => {
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('retailerToken'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchRetailerProfile();
  }, [token]);

  const fetchRetailerProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/api/retailer/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setRetailer(data);
    } catch (error) {
      console.error('Error fetching retailer profile:', error);
      localStorage.removeItem('retailerToken');
      setToken(null);
      setRetailer(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${config.API_URL}/api/retailer/login`, {
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
      localStorage.setItem('retailerToken', data.token);
      setToken(data.token);
      setRetailer(data.retailer);
      toast.success('Login successful');
      navigate('/retailer/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.message);
    }
  };

  const register = async (retailerData) => {
    try {
      const response = await fetch(`${config.API_URL}/api/retailer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(retailerData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('retailerToken', data.token);
      setToken(data.token);
      setRetailer(data.retailer);
      toast.success('Registration successful');
      navigate('/retailer/dashboard');
    } catch (error) {
      console.error('Error registering:', error);
      toast.error(error.message);
    }
  };

  const logout = () => {
    // Set loading to true to prevent any race conditions
    setLoading(true);

    // Clear local storage
    localStorage.removeItem('retailerToken');

    // Reset state
    setToken(null);
    setRetailer(null);

    // Show success message
    toast.success('Logged out successfully');

    // Navigate to login page
    navigate('/retailer/login');

    // Set loading back to false after a short delay to ensure navigation completes
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${config.API_URL}/api/retailer/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      const data = await response.json();
      setRetailer(data);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message);
      return false;
    }
  };

  return (
    <RetailerContext.Provider
      value={{
        retailer,
        loading,
        login,
        register,
        logout,
        updateProfile,
        token
      }}
    >
      {children}
    </RetailerContext.Provider>
  );
};
