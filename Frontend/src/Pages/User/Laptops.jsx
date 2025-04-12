import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Nav';
import Skeleton from '../../Components/Skeleton';
import { toast } from 'react-toastify';
import ProductCard from '../../Components/ProductCard';
import config from '../../config';

const Laptops = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [filterByBrand, setFilterByBrand] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLaptops();
  }, []);

  const fetchLaptops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/products`);
      const data = await response.json();
      const laptopProducts = data.filter(product => product.type === 'laptop');
      setLaptops(laptopProducts);
    } catch (error) {
      console.error('Error fetching laptops:', error);
      toast.error('Failed to fetch laptops');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (laptopId) => {
    try {
      const response = await fetch(`${config.API_URL}/api/products/${laptopId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedLaptops = laptops.map(laptop =>
          laptop._id === laptopId
            ? { ...laptop, liked: !laptop.liked }
            : laptop
        );
        setLaptops(updatedLaptops);
        // Get the current laptop to show the correct toast message
        const currentLaptop = updatedLaptops.find(l => l._id === laptopId);
        toast.success(currentLaptop.liked ? 'Added to favorites' : 'Removed from favorites');
      } else {
        throw new Error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error updating like status:', error);
      toast.error('Failed to update like status');
    }
  };

  const handleAddToCart = async (laptopId) => {
    try {
      const response = await fetch(`${config.API_URL}/api/products/${laptopId}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedLaptops = laptops.map(laptop =>
          laptop._id === laptopId
            ? { ...laptop, inCart: !laptop.inCart }
            : laptop
        );
        setLaptops(updatedLaptops);
        // Get the current laptop to show the correct toast message
        const currentLaptop = updatedLaptops.find(l => l._id === laptopId);
        toast.success(currentLaptop.inCart ? 'Added to cart' : 'Removed from cart');
      } else {
        throw new Error('Failed to update cart status');
      }
    } catch (error) {
      console.error('Error updating cart status:', error);
      toast.error('Failed to update cart status');
    }
  };

  const sortedLaptops = laptops
    .filter(laptop => filterByBrand === '' || laptop.brand.toLowerCase().includes(filterByBrand.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div>
      <Nav />
      <div className="pt-24 md:pt-60 max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Laptops</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our collection of premium laptops.</p>
        </div>

        <div className="mb-6">
          <label className="mr-4">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded p-2"
            disabled={loading}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>

          <label className="ml-6 mr-4">Filter by Brand:</label>
          <input
            type="text"
            value={filterByBrand}
            onChange={(e) => setFilterByBrand(e.target.value)}
            className="border rounded p-2"
            placeholder="Enter brand name"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Skeleton />
              </div>
            ))
          ) : (
            sortedLaptops.map((laptop) => (
              <ProductCard
                key={laptop._id}
                product={laptop}
                onAddToCart={() => handleAddToCart(laptop._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Laptops;