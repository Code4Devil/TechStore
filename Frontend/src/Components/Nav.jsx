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
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both desktop and mobile search containers
      const isOutsideDesktopSearch = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target);
      const isOutsideMobileSearch = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);

      if (isOutsideDesktopSearch && isOutsideMobileSearch) {
        setShowSuggestions(false);
      }
    };

    // Use both mousedown and touchend for better mobile support
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
      setShowSuggestions(false);
      setIsMobileSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('handleSuggestionClick called with:', suggestion);
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    setIsMobileSearchOpen(false); // Close mobile search if open

    // Navigate directly to the product page if we have the product ID
    if (suggestion._id) {
      console.log('Navigating to product page:', `/product/${suggestion._id}`);
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        navigate(`/product/${suggestion._id}`);
      }, 10);
    } else {
      // Fall back to search results if no ID is available
      console.log('Navigating to search results:', `/search?q=${encodeURIComponent(suggestion.name)}`);
      handleSearch(suggestion.name);
      setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(suggestion.name)}`);
      }, 10);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-all duration-300 backdrop-filter backdrop-blur-lg bg-opacity-90">
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
          <div className="hidden md:block flex-1 max-w-xl mx-8" ref={desktopSearchRef}>
            <div className="relative">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  <i className={`fa-solid fa-magnifying-glass ${isLoading ? 'animate-spin' : ''}`}></i>
                </button>
              </form>

              <div className="relative">
                <SearchSuggestions
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  searchQuery={searchQuery}
                  suggestions={suggestions}
                  isLoading={isLoading}
                  handleSuggestionClick={handleSuggestionClick}
                />
              </div>
            </div>
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
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/profile" className="hover:text-blue-600">
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
          <ul className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-8 py-4 md:py-3">
            <li><Link to="/home" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/laptops" className="hover:text-blue-600">Laptops</Link></li>
            <li><Link to="/phones" className="hover:text-blue-600">Smartphones</Link></li>
            <li><Link to="/tablets" className="hover:text-blue-600">Tablets</Link></li>
            <li><Link to="/accessories" className="hover:text-blue-600">Accessories</Link></li>
          </ul>
        </nav>

        {/* Mobile Search */}
        <div className={`${isMobileSearchOpen ? 'block' : 'hidden'} md:hidden border-t py-4`}>
          <div className="relative mobile-search-container" ref={mobileSearchRef}>
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
              </button>
            </form>

            {/* Position the suggestions inside the ref container for proper mobile interaction */}
            <div className="relative">
              <SearchSuggestions
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                searchQuery={searchQuery}
                suggestions={suggestions}
                isLoading={isLoading}
                handleSuggestionClick={handleSuggestionClick}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;