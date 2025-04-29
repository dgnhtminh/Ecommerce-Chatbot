import React, { useEffect, useState } from 'react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [productsMap, setProductsMap] = useState({});

    const fetchUserOrders = async () => {
        try {
            const token = localStorage.getItem('auth-token'); // Lấy token từ localStorage
            const res = await fetch('http://localhost:4000/api/order/userorders', {
                headers: {
                    'auth-token': token // Gửi token trong header 'auth-token'
                }
            });
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []); // 🔥 ép data phải là mảng
        } catch (err) {
            console.error('Error fetching user orders:', err);
            setOrders([]); // 🔥 nếu lỗi thì cũng set thành []
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
        fetchUserOrders();
        fetchProducts();
    }, []);

    const renderCartItems = (cartItems) => {
        return Object.entries(cartItems).map(([key, quantity], idx) => {
            const [productId, size] = key.split('_');
            const productName = productsMap[productId] || 'Unknown Product';
            return (
                <p key={idx} style={{ margin: "5px 0" }}>
                    • {productName} (Size {size}) × {quantity}
                </p>
            );
        });
    };

    return (
        <div className="order-page">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="order-card">
                        {/* <h3>Order #{order._id.slice(-5)}</h3> */}
                        <div><strong>Items:</strong> {renderCartItems(order.cartItems)}</div>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase()} - {order.paymentStatus}</p>
                        <p><strong>Total:</strong> ${order.finalAmount.toFixed(2)}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
