import React, { useEffect, useState, useContext } from 'react';
import { orderService } from '../../api/services';
import { UserContext } from '../../context/UserContext';
import './OrderHistory.css';

function OrderHistory() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderService.getUserOrders(user.id);
      setOrders(res.data);
    } catch (err) {
      setError('Không thể lấy lịch sử đơn hàng');
    }
    setLoading(false);
  };

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">Lịch sử đơn hàng của bạn</h2>
      {loading && <div>Đang tải...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && orders.length === 0 && <div>Bạn chưa có đơn hàng nào.</div>}
      {!loading && orders.length > 0 && (
        <table className="order-history-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Tổng tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.totalAmount.toLocaleString()} VNĐ</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <span className={order.status === 'paid' ? 'status-paid' : 'status-pending'}>
                    {order.status === 'paid' ? 'Đã thanh toán' : 'Chờ xác nhận'}
                  </span>
                </td>
                <td style={{textAlign: 'right', fontSize: '0.98em'}}>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistory; 