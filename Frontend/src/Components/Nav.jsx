import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/Cart';
import { useSearch } from '../Context/SearchContext';
import SearchSuggestions from './SearchSuggestions';

const Nav = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { searchQuery, setSearchQuery, handleSearch, suggestions, isLoading } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
      setShowSuggestions(false);
      setIsMobileSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    handleSearch(suggestion.name);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(suggestion.name)}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      {/* Top Bar */}
      <div className="hidden md:block border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-phone text-blue-600"></i>
                +1 234 567 890
              </span>
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-envelope text-blue-600"></i>
                support@techstore.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/home" className="text-2xl font-bold text-blue-600">
            TechStore
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-xl mx-8" ref={searchRef}>
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <i className={`fa-solid fa-magnifying-glass ${isLoading ? 'animate-spin' : ''}`}></i>
              </button>

              <SearchSuggestions
                showSuggestions={showSuggestions}
                searchQuery={searchQuery}
                suggestions={suggestions}
                isLoading={isLoading}
                handleSuggestionClick={handleSuggestionClick}
              />
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <i className="fa-solid fa-magnifying-glass text-xl"></i>
            </button>

            <Link to="/cart" className="relative hover:text-blue-600">
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/profile" className="hidden md:block hover:text-blue-600">
              <i className="fa-regular fa-user text-xl"></i>
            </Link>

            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block border-t`}>
          <ul className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-8 py-4">
            <li><Link to="/home" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/laptops" className="hover:text-blue-600">Laptops</Link></li>
            <li><Link to="/phones" className="hover:text-blue-600">Smartphones</Link></li>
            <li><Link to="/tablets" className="hover:text-blue-600">Tablets</Link></li>
            <li><Link to="/accessories" className="hover:text-blue-600">Accessories</Link></li>
          </ul>
        </nav>

        {/* Mobile Search */}
        <div className={`${isMobileSearchOpen ? 'block' : 'hidden'} md:hidden border-t py-4`}>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
            </button>

            <SearchSuggestions
              showSuggestions={showSuggestions}
              searchQuery={searchQuery}
              suggestions={suggestions}
              isLoading={isLoading}
              handleSuggestionClick={handleSuggestionClick}
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Nav;