import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/suggestions?q=${encodeURIComponent(query.trim())}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Suggestions error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async (query) => {
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query.trim())}`);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();
      setSearchResults(data);
      return data;
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    const results = await fetchSearchResults(query);
    if (results) {
      // Navigation is now handled in the Nav component
      setSuggestions([]);
    }
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      suggestions,
      searchResults,
      isLoading,
      handleSearch,
      fetchSearchResults
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};

export default SearchProvider;