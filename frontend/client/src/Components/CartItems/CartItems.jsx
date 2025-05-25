import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
    const {
        getTotalCartAmount,
        all_product,
        cartItems,
        removeFromCart,
        applyCoupon,
        discount,
        isLoading, 
    } = useContext(ShopContext);

    const [promoInput, setPromoInput] = useState('');
    const navigate = useNavigate();

    const handleApplyCoupon = () => {
        if (promoInput.trim() === '') {
            alert('Vui lòng nhập mã giảm giá');
            return;
        }
        applyCoupon(promoInput);
    };

    const handleCheckout = () => {
        const totalAmount = (getTotalCartAmount() * (1 - discount / 100)).toFixed(2);
        navigate('/checkout', { state: { total: totalAmount } });
    };

    // 🔹 Nếu đang loading dữ liệu, hiển thị trạng thái loading
    if (isLoading) {
        return <div className="cartitems"><p>Loading cart...</p></div>;
    }

    // 🔹 Lọc ra các mục giỏ hàng hợp lệ
    // const validCartEntries = Object.entries(cartItems).filter(([key, quantity]) => {
    //     const [id] = key.split('_');
    //     return quantity > 0 && all_product.some(p => p.id === Number(id));
    // });

    const validCartEntries = Object.entries(cartItems).filter(([key, quantity]) => quantity > 0);

    if (validCartEntries.length === 0) {
        return <div className="cartitems"><p>Your shopping cart is empty.</p></div>;
    }

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />

            {validCartEntries.map(([key, quantity]) => {
                const [id, size] = key.split('_');
                const product = all_product.find(p => p.id === Number(id));
                if (!product) return null;

                return (
                    <div key={key}>
                        <div className="cartitems-format cartitems-format-main">
                            <img src={product.image} alt="" className='carticon-product-icon' />
                            <p>
                                {product.name}<br />
                                <span className="cart-size">(Size: {size})</span>
                            </p>
                            <p>${product.new_price}</p>
                            <button className='cartitems-quantity'>{quantity}</button>
                            <p>${(product.new_price * quantity).toFixed(2)}</p>
                            <img
                                className='cartitems-remove-icon'
                                src={remove_icon}
                                onClick={() => removeFromCart(product.id, size)}
                                alt="Remove"
                            />
                        </div>
                        <hr />
                    </div>
                );
            })}

            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        {discount > 0 && (
                            <>
                                <hr />
                                <div className="cartitems-total-item">
                                    <p>Discount ({discount}%)</p>
                                    <p>- ${(getTotalCartAmount() * discount / 100).toFixed(2)}</p>
                                </div>
                            </>
                        )}
                        <hr />
                        <div className='cartitems-total-item'>
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className='cartitems-total-item'>
                            <h3>Total</h3>
                            <h3>${(getTotalCartAmount() * (1 - discount / 100)).toFixed(2)}</h3>
                        </div>
                    </div>
                    <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
                </div>
                <div className="caritems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input
                            type="text"
                            placeholder='promo code'
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                        />
                        <button onClick={handleApplyCoupon}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
