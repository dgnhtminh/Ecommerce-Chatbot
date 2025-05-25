import React, { useState } from 'react';
import './Navbar.css';
import navlogo from '../../assets/nav-logo.svg';
import admin_icon from '../../assets/admin.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xoá token hoặc session nếu có
    localStorage.removeItem('adminToken'); 
    navigate('/login');
  };

  return (
    <div className='navbar'>
      <img src={navlogo} alt="" className="nav-logo" />
      
      <div
        className="nav-profile-container"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <img src={admin_icon} className='nav-profile' alt="" />
        {showDropdown && (
          <div className="nav-dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
