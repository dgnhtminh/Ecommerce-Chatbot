import React, { useEffect, useState } from 'react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [productsMap, setProductsMap] = useState({});

    const fetchUserOrders = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const res = await fetch('http://localhost:4000/api/order/userorders', {
                headers: {
                    'auth-token': token
                }
            });
            const data = await res.json();

            const sortedOrders = Array.isArray(data)
                ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                : [];

            setOrders(sortedOrders);
        } catch (err) {
            console.error('Error fetching user orders:', err);
            setOrders([]);
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

    const cancelOrderHandler = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const res = await fetch('http://localhost:4000/api/order/cancelorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify({ orderId }),
            });

            const result = await res.text();
            alert(result);

            // Refresh orders after cancel
            fetchUserOrders();
        } catch (err) {
            console.error("Error cancelling order:", err);
            alert("Failed to cancel order.");
        }
    };

    return (
        <div className="order-page">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div><strong>Items:</strong> {renderCartItems(order.cartItems)}</div>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase()} - {order.paymentStatus}</p>
                        <p><strong>Total:</strong> ${order.finalAmount.toFixed(2)}</p>
                        {order.status === "processing" && (
                            <div className="order-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={() => cancelOrderHandler(order._id)}
                                >
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
