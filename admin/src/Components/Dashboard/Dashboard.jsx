import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('http://localhost:4000/api/dashboard/stats');
      const data = await res.json();
      setStats(data);
    };

    const fetchMonthlyRevenue = async () => {
      const res = await fetch('http://localhost:4000/api/dashboard/monthly-revenue');
      const data = await res.json();
      setMonthlyRevenue(data);
    };

    fetchStats();
    fetchMonthlyRevenue();
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
          <p>Total Revenue (Delivered)</p>
        </div>
      </div>
      <div className="dashboard-chart">
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyRevenue} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Line type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
