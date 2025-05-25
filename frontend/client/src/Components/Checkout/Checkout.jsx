import React, { useContext, useState } from 'react';
import './Checkout.css';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import momoIcon from '../Assets/momo.png';
import vnpayIcon from '../Assets/vnpay.png';

const Checkout = () => {
    const { getTotalCartAmount, discount, clearCart } = useContext(ShopContext);
    const navigate = useNavigate();

    // Get subtotal safely
    const subtotal = Number(getTotalCartAmount() || 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        country: '',
        phone: '',
        paymentMethod: 'cod'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            // Chỉ cho phép nhập số (không cho phép chữ và số âm)
            const numericValue = value.replace(/\D/g, ''); // Loại bỏ mọi ký tự không phải số
            setFormData({ ...formData, [name]: numericValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleOrder = async (e) => {
        e.preventDefault();

        const orderData = {
            shippingInfo: {
                fullName: formData.name,
                address: `${formData.street}, ${formData.city}, ${formData.country}`,
                phone: formData.phone,
                email: formData.email,
            },
            paymentMethod: formData.paymentMethod,
            discountCode: '', // nếu có, truyền mã giảm giá ở đây
            discountValue: discount,
            totalAmount: subtotal,
            finalAmount: total,
        };

        try {
            const res = await fetch('http://localhost:4000/api/order/placeorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'), // nếu dùng xác thực
                },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();
            if (data.success) {
                clearCart();
                navigate('/order');
            } else {
                alert('Đặt hàng thất bại: ' + data.message);
            }
        } catch (err) {
            console.error('Order error:', err);
            alert('Đã xảy ra lỗi khi đặt hàng!');
        }
    };


    return (
        <form className="checkout" onSubmit={handleOrder}>
            <div className="checkout-left">
                <h2>Shipping Information</h2>
                <input
                    required
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    required
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    required
                    type="text"
                    placeholder="Street Address"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                />
                <input
                    required
                    type="text"
                    placeholder="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                />
                <input
                    required
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                />
                <input
                    required
                    type="text"
                    placeholder="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    inputMode="numeric" // Gợi ý bàn phím số trên mobile
                    pattern="[0-9]*"    // Đảm bảo chỉ nhập số khi submit
                />
            </div>
            
            <div className="checkout-right">
                <h2>Order Summary</h2>
                <div className="checkout-summary-item">
                    <p>Subtotal:</p>
                    <p>${subtotal.toFixed(2)}</p>
                </div>

                {discount > 0 && (
                    <div className="checkout-summary-item">
                        <p>Discount ({discount}%):</p>
                        <p>- ${discountAmount.toFixed(2)}</p>
                    </div>
                )}
                <div className="checkout-summary-item">
                    <p>Shipping:</p>
                    <p>Free</p>
                </div>
                <hr />
                <div className="checkout-summary-total">
                    <h3>Total:</h3>
                    <h3>${total.toFixed(2)}</h3>
                </div>
                <h3>Payment Method</h3>
                <div className="checkout-payment-methods">
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="momo"
                            checked={formData.paymentMethod === 'momo'}
                            onChange={handleChange}
                        />
                        <img src={momoIcon} alt="MoMo" className="payment-icon" />
                        <span>MoMo</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="vnpay"
                            checked={formData.paymentMethod === 'vnpay'}
                            onChange={handleChange}
                        />
                        <img src={vnpayIcon} alt="VNPay" className="payment-icon" />
                        <span>VNPay</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={handleChange}
                        />
                        <span>Cash on Delivery</span>
                    </label>
                </div>


                <button type="submit">Place Order</button>
            </div>
        </form>
    );
};

export default Checkout;
