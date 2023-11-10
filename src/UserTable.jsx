import React, { useState } from 'react';

const UserTable = ({ users, onPageChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(''); // Define searchTerm state variable

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm); // Update the searchTerm state variable
    onSearch(searchTerm);
  };

  const itemsPerPage = 3;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        onChange={handleSearch}
      />
      <table>
        {/* ... */}
      </table>
      <div className="pagination">
        {/* ... */}
      </div>
    </div>
  );
};

export default UserTable;
