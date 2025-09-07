import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Admin.css'

function Admin() {
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image: '' });
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleAddItem = (e) => {
    e.preventDefault();
    // Logic để thêm món ăn mới (có thể kết nối với Firebase Firestore)
    console.log('Thêm món mới:', newItem);
    setNewItem({ name: '', price: '', description: '', image: '' });
  };

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="admin-container">
      <h2>Quản Lý Admin</h2>
      <h3>Thêm Món Ăn Mới</h3>
      <form className="admin-form" onSubmit={handleAddItem}>
        <div className="mb-3">
          <label>Tên món</label>
          <input
            type="text"
            className="form-control"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Giá (VNĐ)</label>
          <input
            type="number"
            className="form-control"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mô tả</label>
          <input
            type="text"
            className="form-control"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>URL Hình ảnh</label>
          <input
            type="text"
            className="form-control"
            value={newItem.image}
            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Thêm Món</button>
      </form>
    </div>
  );
}

export default Admin;