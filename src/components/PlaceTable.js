import React from 'react';

const Table = ({ data, loading }) => {
  return (
    <div class="table-container">
      {loading ? (
        <div className="spinner">
          <img className='loader-image' src="https://c.tenor.com/0iK9a1WkT40AAAAC/loading-white.gif" alt="Loading..." />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Place Name</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.city}</td>
                  <td>
                    <img
                      src={`https://flagsapi.com/${item.countryCode}/shiny/24.png`}
                      alt={item.country}
                    />{' '}
                    {item.country}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">
                  {data.length === 0 ? 'No result found' : 'Start searching'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
