import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-title">Quản lý nhà hàng</div>
        <nav className="sidebar-menu">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/menu">Quản lý thực đơn</NavLink>
          <NavLink to="/admin/customers">Khách hàng</NavLink>
          <NavLink to="/admin/statistics">Thống kê</NavLink>
          <NavLink to="/admin/bills">Quản lý hóa đơn</NavLink>
          <NavLink to="/admin/bookings">Quản lý đặt bàn</NavLink>
          <NavLink to="/admin/reviews">
            <i className="fas fa-comments"></i>
            Đánh giá
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/logout" className="logout-link">Đăng xuất</NavLink>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-header-bar">
          <div className="admin-user-info">
            {user ? (
              <span>
                Xin chào, <b>{user.email}</b> ({user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'})
              </span>
            ) : (
              <span>Chưa đăng nhập</span>
            )}
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout; 