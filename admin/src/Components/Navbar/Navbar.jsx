import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navProfile from '../../assets/nav-profile.svg'
import admin_icon from '../../assets/admin.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={navlogo} alt="" className="nav-logo" />
        <img src={admin_icon} className='nav-profile' alt="" />
    </div>
  )
}

export default Navbar
