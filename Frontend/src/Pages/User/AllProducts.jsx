import React, { useEffect, useState } from 'react';
import ProductCard from '../../Components/ProductCard';
import Skeleton from '../../Components/Skeleton';
import { toast } from 'react-toastify';
import Nav from '../../Components/Nav';
import { useCart } from '../../Context/Cart';
import { useSearch } from '../../Context/SearchContext';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId);
    if (success) {
      const updatedProducts = products.map(product => 
        product._id === productId 
          ? { ...product, inCart: !product.inCart }
          : product
      );
      setProducts(updatedProducts);
      const currentProduct = updatedProducts.find(p => p._id === productId);
      toast.success(currentProduct.inCart ? 'Added to cart' : 'Removed from cart');
    } else {
      toast.error('Failed to update cart');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Nav />

      <section id="all_products" className="pt-24 md:pt-64 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of electronics and tech gadgets.
            </p>
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <Skeleton />
                </div>
              ))
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product._id)}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllProducts;