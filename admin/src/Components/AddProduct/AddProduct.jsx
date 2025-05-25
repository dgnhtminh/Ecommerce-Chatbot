import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
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

    const imageHandler = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            setImage(file);
        } else {
            alert('Chỉ được chọn file ảnh!');
            setImage(false);
        }
    };


    const changeHandler = (e) => {
        const { name, value } = e.target;

        // Nếu đang nhập old_price hoặc new_price thì kiểm tra số
        if (name === 'old_price' || name === 'new_price') {
            // Chỉ cho phép số dương
            if (value === '' || (/^\d+(\.\d{0,2})?$/.test(value) && Number(value) > 0)) {
                setProductDetails({ ...productDetails, [name]: value });
            }
        } else {
            setProductDetails({ ...productDetails, [name]: value });
        }
    };


    const toggleSize = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    const Add_Product = async () => {
        console.log(productDetails);
        let responseData;

        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        }).then((resp) => resp.json()).then((data) => { responseData = data });

        if (responseData.success) {
            let product = {
                ...productDetails,
                image: responseData.image_url,
                sizes: selectedSizes
            };

            console.log(product);
            await fetch('http://localhost:4000/api/products/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            }).then((resp) => resp.json()).then((data) => {
                data.success ? alert("Product Added") : alert("Failed")
            });
        }
    };

    return (
        <div className='add-product'>
            <h2 className="addproduct-title">Add New Product</h2>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>

            <div className="addproduct-itemfield">
                <p>Description</p>
                <input value={productDetails.description} onChange={changeHandler} type="text" name='description' placeholder='Type here' />
            </div>

            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
                </div>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Sizes</p>
                <div className="addproduct-sizes-container">
                    {availableSizes.map((size) => (
                        <div
                            key={size}
                            className={`addproduct-size-box ${selectedSizes.includes(size) ? 'selected' : ''}`}
                            onClick={() => toggleSize(size)}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' accept="image/*"  hidden />
            </div>

            <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
        </div>
    )
}

export default AddProduct
