import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Nav';
import Skeleton from '../../Components/Skeleton';
import { toast } from 'react-toastify';
import ProductCard from '../../Components/ProductCard';
import config from '../../config';

const Tablets = () => {
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [filterByBrand, setFilterByBrand] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTablets();
  }, []);

  const fetchTablets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch tablets');
      const data = await response.json();
      const tabletProducts = data.filter(product => product.type === 'tablet');
      setTablets(tabletProducts);
    } catch (error) {
      console.error('Error fetching tablets:', error);
      toast.error('Failed to load tablets');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (tabletId) => {
    try {
      const response = await fetch(`${config.API_URL}/api/products/${tabletId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to update wishlist');

      const updatedTablets = tablets.map(tablet =>
        tablet._id === tabletId
          ? { ...tablet, liked: !tablet.liked }
          : tablet
      );
      setTablets(updatedTablets);
      const currentTablet = updatedTablets.find(t => t._id === tabletId);
      toast.success(currentTablet.liked ? 'Added to wishlist' : 'Removed from wishlist');

      const navUpdateEvent = new CustomEvent('wishlistUpdated');
      window.dispatchEvent(navUpdateEvent);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async (tabletId) => {
    setAddingToCart(tabletId);
    try {
      const response = await fetch(`${config.API_URL}/api/products/${tabletId}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to update cart');

      const updatedTablets = tablets.map(tablet =>
        tablet._id === tabletId
          ? { ...tablet, inCart: !tablet.inCart }
          : tablet
      );
      setTablets(updatedTablets);
      const currentTablet = updatedTablets.find(t => t._id === tabletId);
      toast.success(currentTablet.inCart ? 'Added to cart' : 'Removed from cart');

      const navUpdateEvent = new CustomEvent('cartUpdated');
      window.dispatchEvent(navUpdateEvent);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const sortedTablets = tablets
    .filter(tablet => filterByBrand === '' || tablet.brand.toLowerCase().includes(filterByBrand.toLowerCase()))
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Tablets</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our collection of premium tablets.</p>
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
          ) : sortedTablets.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No tablets found matching your criteria.</p>
            </div>
          ) : (
            sortedTablets.map((tablet) => (
              <ProductCard
                key={tablet._id}
                product={tablet}
                onAddToCart={() => handleAddToCart(tablet._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tablets;