import React, { useEffect, useState } from 'react';
import './AdminLayout.css';
import { orderService } from '../../api/services';
import { paymentService } from '../../api/services';
import './Admin.css';

function Bills() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = () => {
    orderService.getAll({ page, limit: 10 }).then(res => {
      // Kiểm tra dữ liệu thực tế
      // console.log(res.data);
      setOrders(res.data.orders || res.data); // fallback nếu trả về mảng trực tiếp
      setTotalPages(res.data.totalPages || 1);
    });
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page]);

  const handleConfirmPayment = async (orderId) => {
    if (!window.confirm('Xác nhận đơn hàng này đã được thanh toán?')) return;
    setLoading(true);
    try {
      await paymentService.updatePaymentStatus(orderId, { status: 'paid' });
      fetchOrders();
      alert('Đã xác nhận thanh toán!');
    } catch (err) {
      alert('Lỗi khi xác nhận thanh toán! ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="admin-container">
      <h2>Quản lý hóa đơn</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã hóa đơn</th>
            <th>Email khách</th>
            <th>Ngày</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerEmail}</td>
              <td>{order.createdAt?.slice(0, 10)}</td>
              <td>{order.totalAmount?.toLocaleString()} VNĐ</td>
              <td>
                <span className={order.status === 'paid' ? 'status success' : 'status warning'}>
                  {order.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </td>
              <td>
                {order.status !== 'paid' && (
                  <button className="btn btn-success" onClick={() => handleConfirmPayment(order.id)} disabled={loading}>
                    Xác nhận đã thanh toán
                  </button>
                )}
              </td>
            </tr>
          ))}
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
    </div>
  );
}

export default Bills; 