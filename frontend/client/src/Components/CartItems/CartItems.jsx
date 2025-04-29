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
        discount
    } = useContext(ShopContext);

    const [promoInput, setPromoInput] = useState('');

    const handleApplyCoupon = () => {
        if (promoInput.trim() === '') {
            alert('Vui lòng nhập mã giảm giá');
            return;
        }
        applyCoupon(promoInput);
    };

    //Nut thanh toan
    const navigate = useNavigate();

    const handleCheckout = () => {
        const totalAmount = (getTotalCartAmount() * (1 - discount / 100)).toFixed(2);
        navigate('/checkout', { state: { total: totalAmount } });
    };

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

            {/* Lặp qua cartItems theo key: id_size */}
            {Object.entries(cartItems).map(([key, quantity]) => {
                if (quantity <= 0) return null;

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
                            <p>${product.new_price * quantity}</p>
                            <img
                                className='cartitems-remove-icon'
                                src={remove_icon}
                                onClick={() => removeFromCart(product.id, size)}
                                alt=""
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
