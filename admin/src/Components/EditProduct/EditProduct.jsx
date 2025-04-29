import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './EditProduct.css'
import upload_area from '../../assets/upload_area.svg'

const EditProduct = () => {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();

    const [image, setImage] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const availableSizes = ["S", "M", "L", "XL", "XXL"];

    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: "",
        description: ""
    });

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`http://localhost:4000/api/products/product/${id}`);
            const data = await res.json();
            setProductDetails({
                name: data.name,
                image: data.image,
                category: data.category,
                new_price: data.new_price,
                old_price: data.old_price,
                description: data.description
            });
            setSelectedSizes(data.sizes || []);
        }
        fetchProduct();
    }, [id]);

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const toggleSize = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    const updateProduct = async () => {
        let updatedImageUrl = productDetails.image;

        if (image) {
            let formData = new FormData();
            formData.append('product', image);
            let responseData;
            await fetch('http://localhost:4000/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            }).then((resp) => resp.json()).then((data) => { responseData = data });

            if (responseData.success) {
                updatedImageUrl = responseData.image_url;
            }
        }

        let updatedProduct = {
            ...productDetails,
            image: updatedImageUrl,
            sizes: selectedSizes
        };

        await fetch(`http://localhost:4000/api/products/updateproduct/${id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        }).then((resp) => resp.json()).then((data) => {
            if (data.success) {
                alert('Product updated successfully');
                navigate('/listproduct');
            } else {
                alert('Failed to update product');
            }
        });
    };

    return (
        <div className='edit-product'>
            <h2>Edit Product</h2>

            <div className="editproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>

            <div className="editproduct-itemfield">
                <p>Description</p>
                <input value={productDetails.description} onChange={changeHandler} type="text" name='description' placeholder='Type here' />
            </div>

            <div className="editproduct-price">
                <div className="editproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
                </div>
                <div className="editproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
                </div>
            </div>

            <div className="editproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='edit-product-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>

            <div className="editproduct-itemfield">
                <p>Product Sizes</p>
                <div className="editproduct-sizes-container">
                    {availableSizes.map((size) => (
                        <div
                            key={size}
                            className={`editproduct-size-box ${selectedSizes.includes(size) ? 'selected' : ''}`}
                            onClick={() => toggleSize(size)}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            <div className="editproduct-itemfield">
                <label htmlFor="file-input">
                    <img
                        src={image ? URL.createObjectURL(image) : productDetails.image || upload_area}
                        className='editproduct-thumbnail-img'
                        alt=""
                    />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>

            <button onClick={updateProduct} className='editproduct-btn'>UPDATE</button>
        </div>
    )
}

export default EditProduct
