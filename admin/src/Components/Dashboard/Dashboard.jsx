import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/dashboard/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>{stats.totalProducts}</h2>
          <p>Total Products</p>
        </div>
        <div className="dashboard-card">
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>
        <div className="dashboard-card">
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>
        <div className="dashboard-card revenue">
          <h2>${stats.totalRevenue.toLocaleString()}</h2>
          <p>Total Revenue (Shipped)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
