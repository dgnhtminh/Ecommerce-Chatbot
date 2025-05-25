import React, { useEffect, useState } from 'react';
import './CSS/ShopCategory.css';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [notFound, setNotFound] = useState(false);

  const fetchProductsByCategory = async (category, page = 1, search = '') => {
    try {
      const res = await fetch(`http://localhost:4000/api/products/category/${category}?page=${page}&search=${search}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setNotFound(data.products.length === 0);
      }
    } catch (err) {
      console.error("Lỗi khi fetch sản phẩm theo category:", err);
    }
  };


  useEffect(() => {
    fetchProductsByCategory(props.category, 1, searchTerm);
  }, [props.category]);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchProductsByCategory(props.category, page, searchTerm);
    }
  };


  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, '...');
      } else if (currentPage >= totalPages - 2) {
        pages.push('...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return <span key={index} className="pagination-ellipsis">...</span>;
      }

      return (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />

      <div className="shopcategory-search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchProductsByCategory(props.category, 1, searchTerm);
            }
          }}
        />
        <button onClick={() => fetchProductsByCategory(props.category, 1, searchTerm)}>
          Search
        </button>
      </div>

      <div className="shopcategory-products">
        {notFound ? (
          <p className="not-found-message">No matching products found.</p>
        ) : (
            products.map((item, i) => (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))
        )}
      </div>

      <div className="shopcategory-pagination-numbers">
        <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>
        {renderPageNumbers()}
        <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ShopCategory;
