import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptonBox/DescriptionBox';

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = all_product.find(e => e.id === Number(productId));
    if (found) {
      setProduct(found);
    } else {
      // gọi API riêng lấy sản phẩm theo ID
      fetch(`http://localhost:4000/api/products/product/${productId}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(err => {
          console.error("Lỗi fetch sản phẩm theo ID:", err);
        });
    }
  }, [productId, all_product]);

  if (!product) return <div>Loading sản phẩm...</div>;

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
    </div>
  );
};

export default Product;
