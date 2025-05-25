import React, { useEffect } from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import ListUser from '../../Components/ListUser/ListUser';
import ListOrder from '../../Components/ListOrder/ListOrder';
import ListCoupon from '../../Components/ListCoupon/ListCoupon';
import AddCoupon from '../../Components/AddCoupon/AddCoupon';
import EditProduct from '../../Components/EditProduct/EditProduct';
import EditCoupon from '../../Components/EditCoupon/EditCoupon';
import Dashboard from '../../Components/Dashboard/Dashboard';

const Admin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className='admin'>
            <Sidebar />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/addproduct' element={<AddProduct />} />
                <Route path='/listproduct' element={<ListProduct />} />
                <Route path='/listuser' element={<ListUser />} />
                <Route path='/listorder' element={<ListOrder />} />
                <Route path='/listcoupon' element={<ListCoupon />} />
                <Route path="/addcoupon" element={<AddCoupon />} />
                <Route path="/editproduct/:id" element={<EditProduct />} />
                <Route path="/editcoupon/:id" element={<EditCoupon />} />
            </Routes>
        </div>
    );
};

export default Admin;
