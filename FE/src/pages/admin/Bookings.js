import React, { useEffect, useState } from 'react';
import { bookingService } from '../../api/services';
import './AdminLayout.css';
import dayjs from 'dayjs';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingService.getAll({ page, limit: 10 });
      setBookings(res.data.bookings || res.data);
      if (res.data.totalPages) setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Lỗi khi lấy danh sách đặt bàn!'
      );
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [page]);

  const handleAccept = async (id) => {
    setLoading(true);
    try {
      await bookingService.accept(id);
      fetchBookings();
      alert('Đã chấp nhận đơn đặt bàn!');
    } catch (err) {
      alert('Lỗi khi chấp nhận đơn!');
    }
    setLoading(false);
  };

  const handleReject = async (id) => {
    setLoading(true);
    try {
      await bookingService.reject(id);
      fetchBookings();
      alert('Đã từ chối đơn đặt bàn!');
    } catch (err) {
      alert('Lỗi khi từ chối đơn!');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá đơn đặt bàn này?')) return;
    setLoading(true);
    try {
      await bookingService.delete(id);
      fetchBookings();
      alert('Đã xoá đơn đặt bàn!');
    } catch (err) {
      alert('Lỗi khi xoá đơn!');
    }
    setLoading(false);
  };

  return (
    <div className="admin-container">
      <h2>Danh sách đặt bàn</h2>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {loading ? (
        <div style={{ textAlign: 'center', margin: 30 }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đặt bàn</th>
                <th>Số người</th>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>
                    Không có đơn đặt bàn nào.
                  </td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.people}</td>
                    <td>{b.date ? dayjs(b.date).format('DD/MM/YYYY') : ''}</td>
                    <td>{b.time ? dayjs(b.time, 'HH:mm:ss').format('HH:mm') : ''}</td>
                    <td>{b.status || 'chờ xử lý'}</td>
                    <td>
                      {b.status !== 'accepted' && (
                        <button className="btn-accept" onClick={() => handleAccept(b.id)} disabled={loading}>Chấp nhận</button>
                      )}
                      {b.status !== 'rejected' && (
                        <button className="btn-reject" onClick={() => handleReject(b.id)} disabled={loading} style={{marginLeft: 8}}>Từ chối</button>
                      )}
                      <button className="btn-delete" onClick={() => handleDelete(b.id)} disabled={loading} style={{marginLeft: 8}}>Xoá</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button
              className="paginationButton"
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
            >
              <i className="fas fa-chevron-left" style={{ marginRight: 4 }}></i>
              Trang trước
            </button>
            <span className="pageInfo">
              Trang {page} / {totalPages}
            </span>
            <button
              className="paginationButton"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || loading}
            >
              Trang tiếp
              <i className="fas fa-chevron-right" style={{ marginLeft: 4 }}></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Bookings;
