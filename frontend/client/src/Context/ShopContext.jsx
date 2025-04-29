import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState({}); // changed to object like { "12_M": 1 }
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        fetch('http://localhost:4000/api/products/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data));

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/api/cart/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            })
                .then((response) => response.json())
                .then((data) => setCartItems(data));
        }
    }, []);

    // ---------- ADD TO CART ----------
    const addToCart = (productId, size) => {
        const key = `${productId}_${size}`;
        setCartItems((prev) => ({
            ...prev,
            [key]: (prev[key] || 0) + 1
        }));

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/api/cart/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: key })
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    // ---------- REMOVE FROM CART ----------
    const removeFromCart = (productId, size) => {
        const key = `${productId}_${size}`;
        setCartItems((prev) => {
            const updated = { ...prev };
            if (updated[key]) {
                updated[key]--;
                if (updated[key] <= 0) delete updated[key];
            }
            return updated;
        });

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/api/cart/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: key })
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    // ---------- CLEAR CART ----------
    const clearCart = () => {
        setCartItems({}); // clear ở phía client
    
        // Nếu đã đăng nhập thì xóa ở server
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/api/cart/clearcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}) // có thể không cần body
            })
            .then((res) => res.json())
            .then((data) => console.log('Cart cleared on server:', data))
            .catch((err) => console.error('Error clearing cart on server:', err));
        }
    };
    

    // ---------- APPLY COUPON ----------
    const applyCoupon = async (code) => {
        try {
            const res = await fetch('http://localhost:4000/api/coupon/validate-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();

            if (data.success) {
                setDiscount(data.discount);
                alert(`Áp dụng mã thành công: -${data.discount}%`);
            } else {
                setDiscount(0);
                alert(data.message);
            }
        } catch (err) {
            console.error('Lỗi khi áp dụng mã:', err);
            alert('Đã xảy ra lỗi, vui lòng thử lại sau');
        }
    };

    // ---------- GET TOTAL AMOUNT ----------
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const key in cartItems) {
            const [id] = key.split('_');
            const product = all_product.find(p => p.id === Number(id));
            if (product) {
                totalAmount += product.new_price * cartItems[key];
            }
        }
        return Number(totalAmount.toFixed(2));
    };

    // ---------- GET TOTAL ITEMS ----------
    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce((acc, quantity) => acc + quantity, 0);
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        discount,
        setDiscount,
        applyCoupon,
        clearCart
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
