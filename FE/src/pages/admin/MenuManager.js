import React, { useEffect, useState } from 'react';
import { menuService } from '../../api/services';
import './Admin.css';

function MenuManager() {
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image: '' });

  // Lấy danh sách món ăn từ BE khi load trang
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    menuService.getAll().then(res => {
      setMenu(res.data.menu || res.data); // tuỳ backend trả về
    });
  };

  // Thêm món ăn mới
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await menuService.addItem(newItem);
      setNewItem({ name: '', price: '', description: '', image: '' });
      fetchMenu(); // reload lại danh sách món ăn
      alert('Thêm món ăn thành công!');
    } catch (err) {
      alert('Thêm món ăn thất bại!');
    }
  };

  // (Nếu muốn) Xóa món ăn
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa món này?')) {
      await menuService.deleteItem(id);
      fetchMenu();
    }
  };

  return (
    <div className="admin-container">
      <h2>Quản lý thực đơn</h2>
      <form className="menu-manager-form" onSubmit={handleAdd}>
        <input type="text" placeholder="Tên món" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
        <input type="number" placeholder="Giá" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required />
        <input type="text" placeholder="Mô tả" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
        <input type="text" placeholder="Hình ảnh" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} />
        <button type="submit">Thêm món</button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Tên món</th>
            <th>Giá (VNĐ)</th>
            <th>Mô tả</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {menu.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price?.toLocaleString()}</td>
              <td>{item.description}</td>
              <td>
                {item.image && <img src={item.image} alt={item.name} style={{ width: 60, height: 40, objectFit: 'cover' }} />}
              </td>
              <td>
                <button onClick={() => handleDelete(item.id)} className="btn-danger">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MenuManager; 