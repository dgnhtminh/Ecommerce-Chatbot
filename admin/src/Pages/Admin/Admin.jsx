import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import {Routes, Route} from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import ListUser from '../../Components/ListUser/ListUser'
import ListOrder from '../../Components/ListOrder/ListOrder'
import ListCoupon from '../../Components/ListCoupon/ListCoupon'
import AddCoupon from '../../Components/AddCoupon/AddCoupon'
import EditProduct from '../../Components/EditProduct/EditProduct'
import EditCoupon from '../../Components/EditCoupon/EditCoupon'

const Admin = () => {
  return (
    <div className='admin'>
        <Sidebar />
        <Routes>
            <Route path='/addproduct' element={<AddProduct/>}/>
            <Route path='/listproduct' element={<ListProduct/>}/>
            <Route path='/listuser' element={<ListUser/>}/>
            <Route path='/listorder' element={<ListOrder/>}/>
            <Route path='/listcoupon' element={<ListCoupon/>}/>
            <Route path="/addcoupon" element={<AddCoupon />} />
            <Route path="/editproduct/:id" element={<EditProduct />} />
            <Route path="/editcoupon/:id" element={<EditCoupon />} />
        </Routes>
    </div>
  )
}

export default Admin
