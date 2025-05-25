import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [discount, setDiscount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            let page = 1;
            let allProducts = [];
            let totalPages = 1;

            do {
                const res = await fetch(`http://localhost:4000/api/products/allproducts?page=${page}&limit=100`);
                const data = await res.json();
                allProducts = [...allProducts, ...data.products];
                totalPages = data.totalPages || 1;
                page++;
            } while (page <= totalPages);

            setAll_Product(allProducts);

            if (localStorage.getItem('auth-token')) {
                const resCart = await fetch('http://localhost:4000/api/cart/getcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: "",
                });
                const cartData = await resCart.json();

                const filteredCart = {};
                for (const key in cartData) {
                    const [id] = key.split('_');
                    if (allProducts.some(p => p.id === Number(id)) && cartData[key] > 0) {
                        filteredCart[key] = cartData[key];
                    }
                }
                setCartItems(filteredCart);
            }

            setIsLoading(false);
        } catch (err) {
            console.error('Lỗi khi fetch dữ liệu:', err);
            setIsLoading(false);
        }
    };


    const fetchProductsByCategory = async (category) => {
        try {
            setIsLoading(true);
            const res = await fetch(`http://localhost:4000/api/products/category/${category}`);
            const data = await res.json();
            setAll_Product(data);
            setIsLoading(false);
        } catch (err) {
            console.error("Lỗi khi fetch sản phẩm theo category:", err);
            setIsLoading(false);
        }
    };

    const addToCart = (productId, size, quantity) => {
        const key = `${productId}_${size}`;

        setCartItems(prev => ({
            ...prev,
            [key]: (prev[key] || 0) + quantity
        }));

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/api/cart/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: key, quantity })  
            })
                .then(res => res.json())
                .then(data => console.log(data));
        }
    };


    const removeFromCart = (productId, size) => {
        const key = `${productId}_${size}`;
        setCartItems(prev => {
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
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: key })
            }).then(res => res.json()).then(data => console.log(data));
        }
    };

    const clearCart = () => {
        setCartItems({});
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/api/cart/clearcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            })
                .then(res => res.json())
                .then(data => console.log('Cart cleared on server:', data))
                .catch(err => console.error('Error clearing cart on server:', err));
        }
    };

    const applyCoupon = async (code) => {
        try {
            const res = await fetch('http://localhost:4000/api/coupon/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    const getTotalCartAmount = () => {
        let total = 0;
        for (const key in cartItems) {
            const [id] = key.split('_');
            const product = all_product.find(p => p.id === Number(id));
            if (product) {
                total += product.new_price * cartItems[key];
            }
        }
        return Number(total.toFixed(2));
    };

    const getTotalCartItems = () => {
        return Object.keys(cartItems).length;
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
        clearCart,
        isLoading,
        fetchProductsByCategory // ✅ thêm hàm này vào context
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
