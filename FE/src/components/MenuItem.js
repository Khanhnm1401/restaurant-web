import React from 'react';

function MenuItem({ item, addToCart }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src={item.image} className="card-img-top" alt={item.name} />
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text">{item.description}</p>
          <p className="card-text"><strong>{item.price} VNĐ</strong></p>
          <button className="btn btn-primary" onClick={() => addToCart(item)}>
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;