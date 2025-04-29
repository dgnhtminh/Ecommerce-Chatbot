import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditCoupon.css'

const EditCoupon = () => {
    const { id } = useParams();
    const [couponDetails, setCouponDetails] = useState({
        code: '',
        discount: '',
        expiresAt: '',
        isActive: true
    });

    useEffect(() => {
        const fetchCoupon = async () => {
            const res = await fetch(`http://localhost:4000/api/coupon/${id}`);
            const data = await res.json();
            setCouponDetails({
                code: data.code,
                discount: data.discount,
                expiresAt: data.expiresAt ? data.expiresAt.substring(0, 10) : '',
                isActive: data.isActive
            });
        };
        fetchCoupon();
    }, [id]);

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        setCouponDetails(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const navigate = useNavigate();

    const updateCoupon = async () => {
        const res = await fetch(`http://localhost:4000/api/coupon/updatecoupon/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(couponDetails)
        });
        const data = await res.json();
        if (data.success) {
            alert('Coupon updated successfully!');
            navigate('/listcoupon');
        } else {
            alert('Failed to update coupon!');
        }
    };

    return (
        <div className="edit-coupon">
            <h2 className="addcoupon-title">Edit Coupon</h2>
            <div className="addcoupon-itemfield">
                <label>Code</label>
                <input type="text" name="code" value={couponDetails.code} onChange={changeHandler} />
            </div>
            <div className="addcoupon-itemfield">
                <label>Discount (%)</label>
                <input type="number" name="discount" value={couponDetails.discount} onChange={changeHandler} />
            </div>
            <div className="addcoupon-itemfield">
                <label>Expires At</label>
                <input type="date" name="expiresAt" value={couponDetails.expiresAt} onChange={changeHandler} />
            </div>
            <div className="editcoupon-itemfield">
                <label>Is Active</label>
                <label className="switch">
                    <input type="checkbox" name="isActive" checked={couponDetails.isActive} onChange={changeHandler} />
                    <span className="slider round"></span>
                </label>
            </div>
            <button className="addcoupon-btn" onClick={updateCoupon}>
                Update Coupon
            </button>
        </div>
    );
};

export default EditCoupon;
