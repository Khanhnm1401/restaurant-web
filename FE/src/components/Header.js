import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { UserContext } from '../context/UserContext';

function Header() {
  const { user, setUser } = useContext(UserContext);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Restaurant</Link>
      </div>
      <nav className="nav">
        <Link to="/menu">Menu</Link>
        <Link to="/booking">Đặt bàn</Link>
        <Link to="/contact">Liên hệ</Link>
      </nav>
      <div className="user-info">
        {user && user.email ? (
          <div>
            Xin chào, <b>{user.email}</b> ({user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'})
            <button onClick={logout} className="logout-btn">Đăng xuất</button>
          </div>
        ) : (
          <div>
            <Link to="/login">Đăng nhập</Link> / <Link to="/signup">Đăng ký</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header; 