import React from 'react';
import { useParams } from 'react-router-dom';
import './Admin.css';

const customers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0123456789', address: 'Hà Nội' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', phone: '0987654321', address: 'Hồ Chí Minh' },
];

function CustomerDetail() {
  const { id } = useParams();
  const customer = customers.find(c => c.id === Number(id));
  if (!customer) return <div className="admin-container">Không tìm thấy khách hàng</div>;
  return (
    <div className="admin-container">
      <h2>Thông tin khách hàng</h2>
      <p><b>Tên:</b> {customer.name}</p>
      <p><b>Email:</b> {customer.email}</p>
      <p><b>Số điện thoại:</b> {customer.phone}</p>
      <p><b>Địa chỉ:</b> {customer.address}</p>
    </div>
  );
}

export default CustomerDetail; 