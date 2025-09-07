import React, { useEffect, useState } from 'react';
import { statisticsService } from '../../api/services';
import './AdminLayout.css';

function Statistics() {
  const [revenue, setRevenue] = useState(0);
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [label, setLabel] = useState('Tổng doanh thu');

  // Tổng doanh thu toàn hệ thống
  useEffect(() => {
    statisticsService.getRevenue().then(res => {
      setRevenue(res.data.totalRevenue || res.data.revenue || 0);
      setLabel('Tổng doanh thu');
    });
  }, []);

  // Lấy doanh thu theo ngày
  const fetchRevenueByDay = async () => {
    if (!date) return;
    const res = await statisticsService.getRevenueByDay(date);
    setRevenue(res.data.totalRevenue || 0);
    setLabel(`Doanh thu ngày ${date.split('-').reverse().join('-')}`);
  };

  // Lấy doanh thu theo tháng
  const fetchRevenueByMonth = async () => {
    if (!month) return;
    const res = await statisticsService.getRevenueByMonth(month);
    setRevenue(res.data.totalRevenue || 0);
    setLabel(`Doanh thu tháng ${month}`);
  };

  return (
    <div className="admin-stats-container">
      <h2 className="stats-title">Thống kê doanh thu</h2>
      <div className="stats-filter-row">
        <form className="stats-filter-form" onSubmit={e => { e.preventDefault(); fetchRevenueByDay(); }}>
          <label>Chọn ngày:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="stats-input" />
          <button type="submit" className="stats-btn">Xem</button>
        </form>
        <form className="stats-filter-form" onSubmit={e => { e.preventDefault(); fetchRevenueByMonth(); }}>
          <label>Chọn tháng:</label>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="stats-input" />
          <button type="submit" className="stats-btn">Xem</button>
        </form>
      </div>
      <div className="stats-card">
        <div className="stats-label">{label}</div>
        <div className="stats-value">{revenue.toLocaleString()} <span className="stats-currency">VNĐ</span></div>
      </div>
      <style>{`
        .stats-filter-row {
          display: flex; gap: 32px; margin-bottom: 32px; justify-content: center;
        }
        .stats-filter-form {
          background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(80,80,120,0.08);
          padding: 16px 24px; display: flex; align-items: center; gap: 10px;
        }
        .stats-filter-form label {
          font-size: 1rem; color: #333; margin-right: 6px;
        }
        .stats-input {
          padding: 7px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem;
          background: #f9f9f9; transition: border 0.2s;
        }
        .stats-input:focus {
          border: 1.5px solid #a855f7; outline: none;
        }
        .stats-btn {
          background: #a855f7; color: #fff; border: none; border-radius: 6px;
          padding: 7px 18px; font-size: 1rem; font-weight: 500; cursor: pointer;
          margin-left: 8px; transition: background 0.2s;
        }
        .stats-btn:hover {
          background: #9333ea;
        }
        @media (max-width: 700px) {
          .stats-filter-row { flex-direction: column; gap: 18px; }
          .stats-filter-form { width: 100%; justify-content: flex-start; }
        }
      `}</style>
    </div>
  );
}

export default Statistics; 