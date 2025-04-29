import React, { useEffect, useState } from 'react';
import './Listorder.css';
import cross_icon from '../../assets/cross_icon.png';

const ListOrder = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [productsMap, setProductsMap] = useState({});

    const statusOptions = ['processing', 'shipped', 'delivered', 'cancelled'];

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/order/allorders');
            const data = await res.json();
            setAllOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/products/allproducts');
            const data = await res.json();
            const map = {};
            data.forEach(product => {
                map[product.id] = product.name;
            });
            setProductsMap(map);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

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
        </div>
    );
};

export default ListOrder;
