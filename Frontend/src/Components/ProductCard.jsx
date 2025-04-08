import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../Context/ProductContext';
import { useCart } from '../Context/Cart';
import { toast } from 'react-toastify';
import { getProductIconByType, getIconColorByType } from '../utils/productIcons';

const ProductCard = ({ product }) => {
  const { setProduct } = useProduct();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleProductClick = () => {
    setProduct(product);
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);
    try {
      const success = await addToCart(product._id);
      if (success) {
        toast.success('Added to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) return null;

  const isIcon = product.image?.startsWith('fas');
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div onClick={handleProductClick} className="block cursor-pointer flex-grow">
        <div className="relative">
          <div className="aspect-w-1 aspect-h-1 bg-gray-100">
            <div className="w-full h-full py-6 flex items-center justify-center">
              {isIcon ? (
                <i className={`${product.image} text-4xl text-gray-400`}></i>
              ) : product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    // Replace with category-specific icon when image fails to load
                    e.target.style.display = 'none';
                    // Add icon element after the image
                    const iconElement = document.createElement('i');
                    const iconClass = getProductIconByType(product.type);
                    const colorClass = getIconColorByType(product.type);
                    iconElement.className = `${iconClass} text-5xl ${colorClass}`;
                    e.target.parentNode.appendChild(iconElement);
                  }}
                />
              ) : (
                // No image provided, use category icon
                <i className={`${getProductIconByType(product.type)} text-5xl ${getIconColorByType(product.type)}`}></i>
              )}
            </div>
          </div>
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2 min-h-[24px]">
            {product.isNew && (
              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                New
              </span>
            )}
            <span className="text-sm text-gray-500 truncate">{product.brand}</span>
          </div>

          <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 min-h-[56px]">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2 min-h-[20px]">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas ${i < Math.floor(rating)
                    ? 'fa-star'
                    : i < rating
                    ? 'fa-star-half-alt'
                    : 'fa-star text-gray-300'
                  }`}
                ></i>
              ))}
            </div>
            <span className="text-sm text-gray-500">({reviews})</span>
          </div>

          <div className="flex items-center justify-between mb-2 min-h-[28px]">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {product.quantity <= 5 && product.quantity > 0 && (
              <span className="text-sm text-orange-500 whitespace-nowrap">
                Only {product.quantity} left
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.quantity === 0}
          className={`w-full px-4 py-2 rounded-lg transition-colors ${
            product.quantity === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : isAddingToCart
              ? 'bg-blue-400 cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium`}
        >
          {product.quantity === 0 ? (
            'Out of Stock'
          ) : isAddingToCart ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    image: PropTypes.string,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    quantity: PropTypes.number,
    isNew: PropTypes.bool,
    discount: PropTypes.number
  }).isRequired
};

export default ProductCard;