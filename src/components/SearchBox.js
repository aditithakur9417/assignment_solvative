import React from 'react';
import "../styles/searchBox.css"

const SearchBox = ({ query, setQuery, onKeyPress }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyPress} // Trigger API fetch on Enter key press
      />
    </div>
  );
};

export default SearchBox;
