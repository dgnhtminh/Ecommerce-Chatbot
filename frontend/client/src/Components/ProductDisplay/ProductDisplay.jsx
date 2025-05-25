import React, { useContext, useState, useEffect } from 'react'
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext'

const ProductDisplay = (props) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const { product } = props;
    const { addToCart } = useContext(ShopContext);

    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");

    const handleAddToCart = () => {
        if (!selectedSize) {
            setError("Please select a size before adding to cart.");
            return;
        }
        setError("");
        addToCart(product.id, selectedSize, quantity); 
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>

            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                </div>

                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">${product.old_price}</div>
                    <div className="productdisplay-right-price-new">${product.new_price}</div>
                </div>

                <div className="product-right-description">
                    {product.description}
                </div>

                <div className="productdisplay-right-size">
                    <h1>Select Size:</h1>
                    <div className="productdisplay-right-sizes">
                        {product.sizes && product.sizes.map((size) => (
                            <div
                                key={size}
                                className={`product-size-box ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </div>

                <div className="productdisplay-quantity">
                    <h1>Quantity:</h1>
                    <div className="quantity-controls">
                        <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>−</button>
                        <input
                            type="text"
                            value={quantity}
                            readOnly
                        />
                        <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
                    </div>
                </div>

                <button className="add-to-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>

                <p className='productdisplay-right-category'><span>Category: </span>{product.category}</p>
                <p className='productdisplay-right-category'><span>Tags: </span>Modern, Latest</p>
            </div>
        </div>
    )
}

export default ProductDisplay
