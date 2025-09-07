import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuService, bookingService, userService } from '../../api/services';
import './Admin.css';

function Dashboard() {
  const [stats, setStats] = useState([
    { label: 'Tổng số món ăn', value: 0 },
    { label: 'Đơn đặt bàn', value: 0 },
    { label: 'Người dùng', value: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        // Lấy tổng số món ăn
        const menuRes = await menuService.getAll();
        const menuCount = Array.isArray(menuRes.data.menu)
          ? menuRes.data.menu.length
          : Array.isArray(menuRes.data)
          ? menuRes.data.length
          : 0;
        // Lấy tổng số đơn đặt bàn
        const bookingRes = await bookingService.getAll({ page: 1, limit: 1 });
        const bookingCount = bookingRes.data.total || (Array.isArray(bookingRes.data.bookings) ? bookingRes.data.bookings.length : 0);
        // Lấy tổng số người dùng
        const userRes = await userService.getAllNoPaging();
        const userCount = Array.isArray(userRes.data.users)
          ? userRes.data.users.length
          : Array.isArray(userRes.data)
          ? userRes.data.length
          : 0;
        setStats([
          { label: 'Tổng số món ăn', value: menuCount },
          { label: 'Đơn đặt bàn', value: bookingCount },
          { label: 'Người dùng', value: userCount },
        ]);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu thống kê!');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {loading ? (
        <div style={{ textAlign: 'center', margin: 30 }}>Đang tải dữ liệu...</div>
      ) : (
        <div className="dashboard-stats">
          {stats.map((item, idx) => (
            <div className="dashboard-card" key={idx}>
              <div className="dashboard-value">{item.value}</div>
              <div className="dashboard-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="dashboard-actions">
        <Link to="/admin/menu" className="dashboard-btn">Quản lý thực đơn</Link>
        <Link to="/admin/customers" className="dashboard-btn">Danh sách khách hàng</Link>
        <Link to="/admin/statistics" className="dashboard-btn">Thống kê</Link>
      </div>
    </div>
  );
}

export default Dashboard; 