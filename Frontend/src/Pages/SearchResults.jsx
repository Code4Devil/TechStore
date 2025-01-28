import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../Components/Nav';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/products/search?q=${encodeURIComponent(query)}`);
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
        <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
        {loading ? (
          <div>Loading...</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-4">
                <div className="text-center mb-4">
                  <i className={`fas ${product.image || 'fa-box'} text-4xl text-gray-400`}></i>
                </div>
                <h3 className="font-semibold">{product.name}</h3>
                {product.brand && <p className="text-gray-500">{product.brand}</p>}
                {product.price && <p className="text-blue-600 font-medium">${product.price.toFixed(2)}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
