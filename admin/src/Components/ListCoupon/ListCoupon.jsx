import React, { useEffect, useState } from 'react'
import './ListCoupon.css'
import cross_icon from '../../assets/cross_icon.png'
import edit_icon from '../../assets/edit_icon.png';
import { useNavigate } from 'react-router-dom'; // import điều hướng

const ListCoupon = () => {

    const [allcoupons, setAllcoupons] = useState([]);

    const navigate = useNavigate();

    const goToAddCoupon = () => {
        navigate('/addcoupon'); // đường dẫn tới trang thêm coupon
    };

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/api/coupon/allcoupons')
            .then((res) => res.json())
            .then((data) => { setAllcoupons(data) });
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    const remove_coupon = async (id) => {
        await fetch('http://localhost:4000/api/coupon/removecoupon', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        await fetchInfo();
    }

    const edit_coupon = (id) => {
        window.location.href = `/editcoupon/${id}`;
      };

    return (
            <div className='list-coupon'>
                <h1>All coupons List</h1>
                <div className="listcoupon-header">
                    <button className="add-coupon-button" onClick={goToAddCoupon}>
                        ADD COUPON
                    </button>
                </div>
                <div className="listcoupon-format-main">
                    <p>No.</p>
                    <p>Code</p>
                    <p>Discount (%)</p>
                    <p>Expires</p>
                    <p>Status</p>
                    <p>Action</p>
                </div>
                <div className="listcoupon-allcoupons">
                    <hr />
                    {allcoupons.map((coupon, index) => (
                        <div key={coupon._id}>
                            <div className="listcoupon-format-main listcoupon-format">
                                <p>{index + 1}</p>
                                <p>{coupon.code}</p>
                                <p>{coupon.discount}</p>
                                <p>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No Expiry'}</p>
                                <p>{coupon.isActive ? 'Active' : 'Inactive'}</p>
                                <img onClick={() => { edit_coupon(coupon._id) }} className='listcoupon-edit-icon' src={edit_icon} alt="" />
                                <img
                                    onClick={() => remove_coupon(coupon._id)}
                                    className='listcoupon-remove-icon'
                                    src={cross_icon}
                                    alt="Remove"
                                />
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
    )
}

export default ListCoupon
