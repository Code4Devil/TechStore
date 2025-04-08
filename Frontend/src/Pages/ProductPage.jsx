import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../Context/ProductContext';
import { useCart } from '../Context/Cart';
import Nav from '../Components/Nav';
import { toast } from 'react-toastify';
import { getProductIconByType, getIconColorByType } from '../utils/productIcons';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, setProduct } = useProduct();
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Check if product is already in cart
  const isInCart = cartItems?.some(item => item.product._id === product?._id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (!product || product._id !== id) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, setProduct, navigate, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      const success = await addToCart(product._id, quantity);
      if (success) {
        toast.success('Added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div>
      <Nav />
      <section id="productShowcase" className="bg-white pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images Gallery */}
            <div className="md:w-1/2">
              <div className="product-gallery sticky top-24">
                <div className="main-image bg-neutral-100 rounded-lg p-6 mb-4">
                  <div className="aspect-w-1 aspect-h-1">
                    <div className="w-full h-full flex items-center justify-center">
                      {product.image?.startsWith('fas') ? (
                        <i className={`${product.image} text-6xl text-gray-400`}></i>
                      ) : product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            // Replace with category-specific icon when image fails to load
                            e.target.style.display = 'none';
                            // Add icon element after the image
                            const iconElement = document.createElement('i');
                            const iconClass = getProductIconByType(product.type);
                            const colorClass = getIconColorByType(product.type);
                            iconElement.className = `${iconClass} text-6xl ${colorClass}`;
                            e.target.parentNode.appendChild(iconElement);
                          }}
                        />
                      ) : (
                        // No image provided, use category icon
                        <i className={`${getProductIconByType(product.type)} text-6xl ${getIconColorByType(product.type)}`}></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2">
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-neutral-600">
                  ({product.reviews || 0} reviews)
                </span>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-neutral-900">
                  ${product.price?.toFixed(2)}
                </p>
                {product.originalPrice > product.price && (
                  <p className="text-neutral-600 line-through">
                    ${product.originalPrice?.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="flex space-x-4 mb-6">
                <div className="w-32">
                  <label htmlFor="quantity" className="sr-only">Quantity</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                    disabled={isInCart}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isInCart
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  } text-white transition-colors duration-200`}
                  disabled={isInCart}
                >
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>

              {/* Product description and features */}
              <div className="border-t border-neutral-200 pt-6">
                <p className="text-neutral-600 mb-4">{product.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <i className="fas fa-truck text-neutral-500 mr-2"></i>
                    <span className="text-neutral-600">Fast Delivery</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-shield-alt text-neutral-500 mr-2"></i>
                    <span className="text-neutral-600">Secure Payment</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-undo text-neutral-500 mr-2"></i>
                    <span className="text-neutral-600">30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;