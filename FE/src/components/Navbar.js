import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Navbar({ cartCount }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header id="header">
      <div className="menu-toggle" onClick={toggleNav}>
        <span className="hamburger">☰</span>
      </div>
      <ul id="nav" className={isNavOpen ? 'active' : ''}>
        <li>
          <Link to="/">Trang Chủ</Link>
        </li>
        <li>
          <Link to="/menu">Thực Đơn</Link>
        </li>
        <li>
          <Link to="/cart">Giỏ Hàng ({cartCount})</Link>
        </li>
        {/* <li>
          <Link to="/about">Giới Thiệu</Link>
        </li> */}
         <li>
        <Link to="/order-history">Lịch sử đơn hàng</Link>
        </li>
        <li>
          <Link to="/booking">Đặt Bàn</Link>
        </li>
        {/* <li>
          <Link to="/delivery">Giao Hàng</Link>
        </li> */}
        {/* <li>
          <Link to="/reviews">Đánh Giá</Link>
        </li> */}
        <li>
          <Link to="/admin">Quản Trị</Link>
        </li>
       
      </ul>
      <div className="auth-buttons">
        {user && user.email ? (
          <>
            <span style={{ fontWeight: 500 }}>
              Xin chào, <b>{user.email}</b> ({user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'})
            </span>
            <button onClick={logout} className="auth-link" style={{ marginLeft: 12, background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 12px', cursor: 'pointer' }}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">Đăng Nhập</Link>
            <span className="auth-separator">/</span>
            <Link to="/signup" className="auth-link">Đăng Ký</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;