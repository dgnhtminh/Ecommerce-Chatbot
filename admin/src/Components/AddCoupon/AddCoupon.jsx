import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCoupon.css';

const AddCoupon = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiresAt, setExpiresAt] = useState('');

    const handleSubmit = async () => {
        if (!code || !discount) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const couponData = {
            code,
            discount: parseInt(discount),
            expiresAt: expiresAt ? new Date(expiresAt) : null
        };

        await fetch('http://localhost:4000/api/coupon/addcoupon', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(couponData)
        });

        navigate('/listcoupon'); // Quay lại trang danh sách coupon
    };

    return (
        <div className="add-coupon">
            <h2 className="addcoupon-title">Add New Coupon</h2>

            <div className="addcoupon-itemfield">
                <label>Coupon Code</label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter coupon code"
                />
            </div>

            <div className="addcoupon-itemfield">
                <label>Discount (%)</label>
                <input
                    type="text"
                    value={discount}
                    onChange={(e) => {
                        const value = e.target.value;

                        // Chỉ cho phép số nguyên dương từ 1 đến 100
                        if (/^\d{0,3}$/.test(value)) {
                            const numericValue = Number(value);
                            if (numericValue >= 1 && numericValue <= 100) {
                                setDiscount(value);
                            } else if (value === "") {
                                setDiscount("");
                            }
                        }
                    }}
                    placeholder="Enter discount"
                />
            </div>

            <div className="addcoupon-itemfield">
                <label>Expiry Date</label>
                <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                />
            </div>

            <button className="addcoupon-btn" onClick={handleSubmit}>
                Add Coupon
            </button>
        </div>
    );
};

export default AddCoupon;
