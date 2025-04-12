import React, { useEffect, useState } from 'react';
import ProductCard from '../Components/ProductCard';
import Skeleton from '../Components/Skeleton';
import { toast } from 'react-toastify';
import { useCart } from '../Context/Cart';
import config from '../config';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/products`);
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

  const getRandomProducts = (products, count) => {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const randomProducts = getRandomProducts(products, 4);

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

  return (
    <section id="featured_products" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our hand-picked selection of premium electronics and trending tech gadgets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Skeleton />
              </div>
            ))
          ) : (
            randomProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product._id)}
              />
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <a href="/products" className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300">
            View All Products
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;