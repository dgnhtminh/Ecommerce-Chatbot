import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';
import edit_icon from '../../assets/edit_icon.png';
import { useNavigate } from 'react-router-dom';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 5;

  const navigate = useNavigate();

  const goToAddProduct = () => {
    navigate('/addproduct');
  };


  const fetchInfo = async (page = 1, search = '') => {
    try {
      const res = await fetch(`http://localhost:4000/api/products/allproducts?page=${page}&limit=${limit}&search=${search}`);
      const data = await res.json();

      setAllProducts(data.products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchInfo(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset về trang đầu khi tìm kiếm
  };

  const remove_product = async (id) => {
    await fetch('http://localhost:4000/api/products/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
    fetchInfo(currentPage, searchTerm);
  };

  const edit_product = (id) => {
    navigate(`/editproduct/${id}`);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='list-product'>
      <h1>All Products List</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="listproduct-search"
      />

      <div className="listproduct-header">
        <button className="add-product-button" onClick={goToAddProduct}>
          ADD PRODUCT
        </button>
      </div>

      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Action</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, index) => (
          <React.Fragment key={product._id || index}>
            <div className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={() => edit_product(product.id)} className='listproduct-edit-icon' src={edit_icon} alt="Edit" />
              <img onClick={() => remove_product(product.id)} className='listproduct-remove-icon' src={cross_icon} alt="Remove" />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2) {
            return (
              <button
                key={page}
                className={currentPage === page ? 'active' : ''}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 3 || page === currentPage + 3) {
            return <span key={page}>...</span>;
          } else {
            return null;
          }
        })}

        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ListProduct;
