import React from 'react';
import PropTypes from 'prop-types';

const SearchSuggestions = ({
  showSuggestions,
  searchQuery,
  suggestions,
  isLoading,
  handleSuggestionClick
}) => {
  if (!showSuggestions || searchQuery.length < 2) return null;

  return (
    <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-[60] max-h-[300px] overflow-y-auto">
      {isLoading ? (
        <div className="px-4 py-2 text-gray-500">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Loading...
        </div>
      ) : suggestions && suggestions.length > 0 ? (
        <ul className="py-2 divide-y divide-gray-100">
          {suggestions.slice(0, 5).map((suggestion) => (
            <li
              key={suggestion._id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <i className={`fas ${suggestion.image || 'fa-box'} text-gray-400 w-6 text-center`}></i>
                <div className="flex-1">
                  <span className="block font-medium text-gray-800">{suggestion.name}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">{suggestion.brand}</span>
                    <span className="text-sm font-medium text-blue-600">
                      ${suggestion.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-2 text-gray-500">No suggestions found</div>
      )}
    </div>
  );
};

SearchSuggestions.propTypes = {
  showSuggestions: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string.isRequired,
  suggestions: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  handleSuggestionClick: PropTypes.func.isRequired
};

export default SearchSuggestions;