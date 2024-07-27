import React from "react";

const Pagination = ({
  totalResults,
  limit,
  currentPage,
  setCurrentPage,
  numberOfPages,
}) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= numberOfPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </button>
      {Array.from({ length: numberOfPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={currentPage === index + 1 ? "active" : ""}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === numberOfPages}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
