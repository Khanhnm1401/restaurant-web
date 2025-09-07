import React, { useEffect, useState } from 'react';
import { publicMenuService } from '../../api/services';

function Menu({ addToCart }) {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    publicMenuService.getAll().then(res => setMenuItems(res.data));
  }, []);

  return (
    <div className="menu-container">
      <div className="left"></div>
      <div className="right">
        <div className="vertical-menu">
          <div className="menu-category">
            <h2 className="category-title">Món Chính</h2>
            <ul className="menu-items">
              {menuItems.map((item) => (
                <li key={item.id} className="menu-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">{item.price?.toLocaleString()} VNĐ</span>
                  <button onClick={() => addToCart(item)}>Thêm</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;