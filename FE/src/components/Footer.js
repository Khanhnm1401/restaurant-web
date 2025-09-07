import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Liên Hệ</h3>
          <p>Email: contact@nhahangxyz.com</p>
          <p>Điện thoại: 0123 456 789</p>
        </div>
        <div className="footer-section">
          <h3>Liên Kết Nhanh</h3>
          <a href="/menu">Thực Đơn</a>
          <a href="/booking">Đặt Bàn</a>
          <a href="/delivery">Giao Hàng</a>
        </div>
        <div className="footer-section">
          <h3>Theo Dõi Chúng Tôi</h3>
          <div className="social-links">
            {/* <a href="">Facebook</a>
            <a href="">Instagram</a>
            <a href="">Twitter</a> */}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Nhà Hàng XYZ. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;