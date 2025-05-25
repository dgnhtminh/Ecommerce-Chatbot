import React, { useEffect, useState } from 'react'
import './ListCoupon.css'
import cross_icon from '../../assets/cross_icon.png'
import edit_icon from '../../assets/edit_icon.png';
import { useNavigate } from 'react-router-dom'; // import điều hướng

const ListCoupon = () => {
    const [allcoupons, setAllcoupons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 5;


    const navigate = useNavigate();

    const goToAddCoupon = () => {
        navigate('/addcoupon'); // đường dẫn tới trang thêm coupon
    };

    const fetchInfo = async (page = 1, search = '') => {
        try {
            const res = await fetch(`http://localhost:4000/api/coupon/allcoupons?page=${page}&limit=${limit}&search=${search}`);
            const data = await res.json();
            setAllcoupons(data.coupons);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Error fetching coupons:", err);
        }
    };


    useEffect(() => {
        fetchInfo(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
            <input
                type="text"
                placeholder="Search by coupon code..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="listcoupon-search"
            />
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
            <div className="pagination-container">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    &lt;
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2) {
                        return (
                            <button
                                key={page}
                                className={currentPage === page ? 'active' : ''}
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </button>
                        );
                    } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return <span key={page}>...</span>;
                    } else {
                        return null;
                    }
                })}

                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    &gt;
                </button>
            </div>
        </div>
    )
}

export default ListCoupon
