import React, { useEffect, useState } from 'react';
import './Listorder.css';
import cross_icon from '../../assets/cross_icon.png';

const ListOrder = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [productsMap, setProductsMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 5;

    const statusOptions = ['processing', 'shipped', 'delivered', 'cancelled'];

    const fetchOrders = async (page = 1, search = '') => {
        try {
            const res = await fetch(`http://localhost:4000/api/order/allorders?page=${page}&limit=${limit}&search=${search}`);
            const data = await res.json();
            setAllOrders(data.orders);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            let page = 1;
            let allProducts = [];
            let totalPages = 1;

            do {
                const res = await fetch(`http://localhost:4000/api/products/allproducts?page=${page}&limit=100`);
                const data = await res.json();
                allProducts = [...allProducts, ...data.products];
                totalPages = data.totalPages;
                page++;
            } while (page <= totalPages);

            const map = {};
            allProducts.forEach(product => {
                map[product.id] = product.name;
            });
            setProductsMap(map);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage, searchTerm);
        fetchProducts();
    }, [currentPage, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset về trang đầu
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const remove_order = async (id) => {
        try {
            await fetch('http://localhost:4000/api/order/removeorder', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            await fetchOrders();
        } catch (err) {
            console.error('Error removing order:', err);
        }
    };

    const renderCartItems = (cartItems) => {
        return Object.entries(cartItems).map(([key, quantity], idx) => {
            const [productId, size] = key.split('_');
            const productName = productsMap[productId] || 'Unknown Product';
            return (
                <p key={idx} style={{ margin: 0 }}>
                    • {productName} (Size {size}): x{quantity}
                </p>
            );
        });
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await fetch('http://localhost:4000/api/order/updateorderstatus', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: orderId, status: newStatus })
            });
            await fetchOrders(); // Cập nhật lại danh sách đơn hàng sau khi thay đổi
        } catch (err) {
            console.error('Error updating order status:', err);
        }
    };

    return (
        <div className='list-order'>
            <h1>All Orders</h1>

            <input
                type="text"
                placeholder="Search by user..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="listorder-search"
            />

            <div
                className="listorder-format-main"
            >
                <p>No.</p>
                <p>User</p>
                <p>Address</p>
                <p>Email</p>
                <p>Products</p>
                <p>Total</p>
                <p>Payment</p>
                <p>Status</p>
                <p>Date</p>
                <p>Cancel</p>
            </div>
            <div className="listorder-allorders">
                <hr />
                {allOrders.map((order, index) => (
                    <div key={order._id}>
                        <div
                            className="listorder-format listorder-format-main"
                        >
                            <p>{index + 1}</p>
                            <p>{order.shippingInfo?.fullName}</p>
                            <p>{order.shippingInfo?.address}</p>
                            <p>{order.shippingInfo?.email}</p>
                            <div>{renderCartItems(order.cartItems)}</div>
                            <p>${order.finalAmount.toFixed(2)}</p>
                            <p>{order.paymentMethod?.toUpperCase()} - {order.paymentStatus}</p>
                            <select
                                className="listorder-status-select"
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <p>{new Date(order.createdAt).toLocaleString()}</p>
                            <img
                                onClick={() => remove_order(order._id)}
                                className='listorder-remove-icon'
                                src={cross_icon}
                                alt="remove"
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
    );
};

export default ListOrder;
