import React, { useEffect, useState } from 'react';
import './ListUser.css';
import cross_icon from '../../assets/cross_icon.png';

const ListUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 5;

  const fetchInfo = async (page = 1, search = '') => {
    try {
      const res = await fetch(`http://localhost:4000/api/users/allusers?page=${page}&limit=${limit}&search=${search}`);
      const data = await res.json();

      setAllUsers(data.users);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchInfo(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const remove_user = async (id) => {
    await fetch('http://localhost:4000/api/users/removeuser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
    fetchInfo(currentPage, searchTerm);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='list-user'>
      <h1>All Users List</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="listuser-search"
      />

      <div className="listuser-format-main">
        <p>No.</p>
        <p>Name</p>
        <p>Email</p>
        <p>Remove</p>
      </div>

      <div className="listuser-allusers">
        <hr />
        {allUsers.map((user, index) => (
          <React.Fragment key={user._id}>
            <div className="listuser-format-main listuser-format">
              <p>{(currentPage - 1) * limit + index + 1}</p>
              <p>{user.name}</p>
              <p>{user.email}</p>
              <img onClick={() => remove_user(user._id)} className='listuser-remove-icon' src={cross_icon} alt="Remove" />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2) {
            return (
              <button
                key={page}
                className={currentPage === page ? 'active' : ''}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 3 || page === currentPage + 3) {
            return <span key={page}>...</span>;
          } else {
            return null;
          }
        })}

        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ListUser;
