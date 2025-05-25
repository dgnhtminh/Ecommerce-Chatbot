import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import AdminLogin from './Components/Login/Login';

const App = () => {
  const location = useLocation();

  // Ẩn Navbar nếu đang ở trang /admin/login
  const hideNavbar = location.pathname === '/login';

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/*" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default App;
