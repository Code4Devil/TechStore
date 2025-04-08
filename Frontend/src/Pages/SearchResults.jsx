import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Nav from '../Components/Nav';
import { getProductIconByType, getIconColorByType } from '../utils/productIcons';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="pt-24 md:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Search Results for "{query}"</h1>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map(product => (
              <Link to={`/product/${product._id}`} key={product._id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                <div className="relative">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                    <div className="w-full h-full py-6 flex items-center justify-center">
                      {product.image?.startsWith('fas') ? (
                        <i className={`${product.image} text-4xl text-gray-400`}></i>
                      ) : product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const iconElement = document.createElement('i');
                            const iconClass = getProductIconByType(product.type);
                            const colorClass = getIconColorByType(product.type);
                            iconElement.className = `${iconClass} text-5xl ${colorClass}`;
                            e.target.parentNode.appendChild(iconElement);
                          }}
                        />
                      ) : (
                        <i className={`${getProductIconByType(product.type)} text-5xl ${getIconColorByType(product.type)}`}></i>
                      )}
                    </div>
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="p-4 flex-grow">
                  <div className="flex items-center gap-2 mb-2 min-h-[24px]">
                    {product.isNew && (
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">New</span>
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
                          className={`fas ${i < Math.floor(product.rating || 0)
                            ? 'fa-star'
                            : i < (product.rating || 0)
                            ? 'fa-star-half-alt'
                            : 'fa-star text-gray-300'
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews || 0})</span>
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <i className="fas fa-search text-gray-300 text-5xl mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-500">We couldn't find any products matching "{query}"</p>
            <div className="mt-6">
              <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium">
                Browse all products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
