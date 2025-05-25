import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={'/dashboard'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <p>Dashboard</p>
        </div>
      </Link>
      <Link to={'/listproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <p>Product List</p>
        </div>
      </Link>
            <Link to={'/listuser'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <p>Users List</p>
        </div>
      </Link>
      <Link to={'/listorder'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <p>Orders List</p>
        </div>
      </Link>
      <Link to={'/listcoupon'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <p>Coupons List</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar
