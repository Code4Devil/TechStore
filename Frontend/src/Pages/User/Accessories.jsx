import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Nav';
import Skeleton from '../../Components/Skeleton';
import { toast } from 'react-toastify';
import ProductCard from '../../Components/ProductCard';

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterByBrand, setFilterByBrand] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error('Failed to fetch accessories');
      const data = await response.json();
      const accessoryProducts = data.filter(product => product.type === 'accessory');
      setAccessories(accessoryProducts);
    } catch (error) {
      console.error('Error fetching accessories:', error);
      toast.error('Failed to load accessories');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (accessoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${accessoryId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to update wishlist');

      const updatedAccessories = accessories.map(accessory => 
        accessory._id === accessoryId 
          ? { ...accessory, liked: !accessory.liked }
          : accessory
      );
      setAccessories(updatedAccessories);
      const currentAccessory = updatedAccessories.find(a => a._id === accessoryId);
      toast.success(currentAccessory.liked ? 'Added to wishlist' : 'Removed from wishlist');
      
      const navUpdateEvent = new CustomEvent('wishlistUpdated');
      window.dispatchEvent(navUpdateEvent);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async (accessoryId) => {
    setAddingToCart(accessoryId);
    try {
      const response = await fetch(`http://localhost:5000/products/${accessoryId}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to update cart');

      const updatedAccessories = accessories.map(accessory => 
        accessory._id === accessoryId 
          ? { ...accessory, inCart: !accessory.inCart }
          : accessory
      );
      setAccessories(updatedAccessories);
      const currentAccessory = updatedAccessories.find(a => a._id === accessoryId);
      toast.success(currentAccessory.inCart ? 'Added to cart' : 'Removed from cart');
      
      const navUpdateEvent = new CustomEvent('cartUpdated');
      window.dispatchEvent(navUpdateEvent);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const sortedAccessories = accessories
    .filter(accessory => filterByBrand === '' || accessory.brand.toLowerCase().includes(filterByBrand.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div>
      <Nav />
      <div className="pt-24 md:pt-60 max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Accessories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our hand-picked selection of premium accessories and trending tech gadgets.</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-gray-700">Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-700">Filter by Brand:</label>
            <input
              type="text"
              value={filterByBrand}
              onChange={(e) => setFilterByBrand(e.target.value)}
              placeholder="Enter brand name"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Skeleton />
              </div>
            ))
          ) : sortedAccessories.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No accessories found matching your criteria.</p>
            </div>
          ) : (
            sortedAccessories.map((accessory) => (
              <ProductCard
                key={accessory._id}
                product={accessory}
                onAddToCart={() => handleAddToCart(accessory._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Accessories;