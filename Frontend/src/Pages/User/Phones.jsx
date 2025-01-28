import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Nav';
import Skeleton from '../../Components/Skeleton';
import { toast } from 'react-toastify';
import ProductCard from '../../Components/ProductCard';

const Phones = () => {
  const [phones, setPhones] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterByBrand, setFilterByBrand] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error('Failed to fetch phones');
      const data = await response.json();
      const phoneProducts = data.filter(product => product.type === 'phone');
      setPhones(phoneProducts);
    } catch (error) {
      console.error('Error fetching phones:', error);
      toast.error('Failed to load phones');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (phoneId) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${phoneId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to update wishlist');

      const updatedPhones = phones.map(phone => 
        phone._id === phoneId 
          ? { ...phone, liked: !phone.liked }
          : phone
      );
      setPhones(updatedPhones);
      const currentPhone = updatedPhones.find(p => p._id === phoneId);
      toast.success(currentPhone.liked ? 'Added to wishlist' : 'Removed from wishlist');
      
      // Update nav wishlist count
      const navUpdateEvent = new CustomEvent('wishlistUpdated');
      window.dispatchEvent(navUpdateEvent);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async (phoneId) => {
    setAddingToCart(phoneId);
    try {
      const response = await fetch(`http://localhost:5000/products/${phoneId}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to update cart');

      const updatedPhones = phones.map(phone => 
        phone._id === phoneId 
          ? { ...phone, inCart: !phone.inCart }
          : phone
      );
      setPhones(updatedPhones);
      const currentPhone = updatedPhones.find(p => p._id === phoneId);
      toast.success(currentPhone.inCart ? 'Added to cart' : 'Removed from cart');
      
      // Update nav cart count
      const navUpdateEvent = new CustomEvent('cartUpdated');
      window.dispatchEvent(navUpdateEvent);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const sortedPhones = phones
    .filter(phone => filterByBrand === '' || phone.brand.toLowerCase().includes(filterByBrand.toLowerCase()))
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Phones</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our collection of premium smartphones.</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-gray-700">Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          ) : sortedPhones.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No phones found matching your criteria.</p>
            </div>
          ) : (
            sortedPhones.map((phone) => (
              <ProductCard
                key={phone._id}
                product={phone}
                onAddToCart={() => handleAddToCart(phone._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Phones;