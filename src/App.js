import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import Table from "./components/PlaceTable";
import Pagination from "./components/Pagination";

import "./styles/styles.css";

// Custom debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const App = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLimit, setFetchLimit] = useState(5); // API fetch limit
  const [itemsPerPage, setItemsPerPage] = useState(3); // Items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Debounced fetch function
  const fetchData = useCallback(
    debounce(async () => {
      setLoading(true);
      try {
        const options = {
          method: "GET",
          url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
          params: {
            namePrefix: query,
            limit: fetchLimit, // Limit the number of items fetched from the server
          },
          headers: {
            "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
          },
        };

        const response = await axios.request(options);
        setData(response.data.data);
        setTotalResults(response.data.metadata.totalCount);
        setLoading(false);
        setCurrentPage(1); // Reset to the first page when new data is fetched
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }, 500),
    [query, fetchLimit]
  ); // Adjust debounce delay as needed

  // Debounced handleFetchLimitChange function
  const handleFetchLimitChange = useCallback(
    debounce((value) => {
      const numValue = Math.min(Math.max(Number(value), 1), 10);
      setFetchLimit(numValue);
      if (numValue > 10) {
        alert("Please enter a value between 1 and 10.");
      }
    }, 300),
    []
  ); // Adjust debounce delay as needed

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value;
    const numValue = Number(value);

    // Validate the input
    if (value === '' || numValue < 1) {
      return; // Do nothing if input is blank or less than 1
    }

    setItemsPerPage(numValue);
    setCurrentPage(1); // Reset to the first page when items per page is changed
  };


  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  const onFetchLimitInputChange = (e) => {
    handleFetchLimitChange(e.target.value);
  };

  // Calculate paginated data
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate number of pages based on fetched data and items per page
  const numberOfPages = Math.ceil(fetchLimit / itemsPerPage);

  useEffect(() => {
    if (query) {
      fetchData(); // Call the debounced fetch function
    }
  }, [query, fetchLimit,  fetchData]);

  return (
    <div className="app">
      <SearchBox
        query={query}
        setQuery={setQuery}
        onKeyPress={handleSearchKeyPress}
      />
      <Table data={paginatedData} loading={loading} />
      <div className="controls">
        <div className="fetch-limit-box">
          <label htmlFor="fetch-limit">API Fetch Limit:</label>
          <input
            type="number"
            id="fetch-limit"
            min="1"
            // max="10"
            value={fetchLimit}
            onChange={onFetchLimitInputChange} // Use the new handler
            className="fetch-limit-input"
          />
        </div>
        <div className="items-per-page-box">
          <label htmlFor="items-per-page">Items per Page:</label>
          <input
            type="number"
            id="items-per-page"
            min="1"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="items-per-page-input"
          />
        </div>
      </div>
      {data.length > 0 && (
        <Pagination
          totalResults={fetchLimit} // Update total results based on API fetch limit
          limit={itemsPerPage} // Items per page for pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numberOfPages={numberOfPages} // Pass the number of pages to Pagination
        />
      )}
    </div>
  );
};

export default App;
