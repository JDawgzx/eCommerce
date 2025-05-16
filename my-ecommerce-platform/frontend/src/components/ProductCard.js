import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
