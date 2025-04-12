import React from 'react';
import PropTypes from 'prop-types';

const SearchSuggestions = ({
  showSuggestions,
  setShowSuggestions,
  searchQuery,
  suggestions,
  isLoading,
  handleSuggestionClick
}) => {
  if (!showSuggestions || searchQuery.length < 2) return null;

  return (
    <div className="absolute w-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-[999] max-h-[300px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      {isLoading ? (
        <div className="px-4 py-2 text-gray-500">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Loading...
        </div>
      ) : suggestions && suggestions.length > 0 ? (
        <ul className="py-2 divide-y divide-gray-100 touch-auto">
          {suggestions.slice(0, 5).map((suggestion) => (
            <li
              key={suggestion._id}
              className="px-0 py-0 hover:bg-gray-50 cursor-pointer transition-colors duration-150 touch-manipulation active:bg-gray-100"
              role="button"
              tabIndex="0"
              aria-label={`View ${suggestion.name}`}
              onKeyDown={(e) => e.key === 'Enter' && handleSuggestionClick(suggestion)}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div
                className="block w-full px-4 py-4"
                onClick={(e) => {
                  // Manually handle navigation instead of using Link
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Suggestion div clicked:', suggestion);
                  handleSuggestionClick(suggestion);
                }}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur event on input
              >
              <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <i className={`fas ${suggestion.image || 'fa-box'} text-gray-400 w-6 text-center`}></i>
                <div className="flex-1 min-w-0">
                  <span className="block font-medium text-gray-800 truncate">{suggestion.name}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">{suggestion.brand}</span>
                    <span className="text-sm font-medium text-blue-600">
                      ${suggestion.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-2 text-blue-600">
                <i className="fas fa-arrow-right"></i>
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
  setShowSuggestions: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  suggestions: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  handleSuggestionClick: PropTypes.func.isRequired
};

export default SearchSuggestions;