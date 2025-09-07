import React from 'react';
import ReviewForm from '../../components/ReviewForm';

function Home() {
  return (
    <div>
      <div id="slider">
        <div className="text-content">
          <div id="text-heading">Nhà Hàng Đồng Quê</div>
          <div className="text-description">Thưởng thức những món ăn ngon nhất!</div>
        </div>
      </div>
      <div id="content">
        <div className="section-content">
          <h2 className="section-heading">Về Chúng Tôi</h2>
          <p className="about-food">
            Nhà Hàng XYZ mang đến những món ăn đậm đà hương vị truyền thống, được chế biến từ nguyên liệu tươi ngon nhất. Chúng tôi cam kết mang lại trải nghiệm ẩm thực tuyệt vời cho mọi thực khách.
          </p>
          <h2 className="food-title">Món Ăn Bán Chạy</h2>
          <div className="bestseller-food">
            <div className="food-items">
              <h3 className="name-food-heading">Phở Bò</h3>
              <img className="foodname" src="https://fohlafood.vn/cdn/shop/articles/bi-quyet-nau-phi-bo-ngon-tuyet-dinh.jpg?v=1712213789" alt="Phở Bò" />
            </div>
            <div className="food-items">
              <h3 className="name-food-heading">Cơm Tấm</h3>
              <img className="foodname" src="https://i-giadinh.vnecdn.net/2024/03/07/7Honthinthnhphm1-1709800144-8583-1709800424.jpg" alt="Cơm Tấm" />
            </div>
            <div className="food-items">
              <h3 className="name-food-heading">Bún Chả</h3>
              <img className="foodname" src="https://danviet.ex-cdn.com/files/f1/296231569849192448/2023/8/23/bao-quoc-te-viet-ve-hanh-trinh-kham-pha-mon-bun-cha-o-goc-pho-ha-noi1-1692783720312-16927837204531322087852.jpg" alt="Bún Chả" />
            </div>
          </div>
        </div>
        <div className="contact-section">
          <h2 className="contact-title">Liên Hệ</h2>
          <div className="contact-container">
            <div className="contact-info">
              <p>Địa chỉ: 123 Đường Ẩm Thực, TP. HCM</p>
              <p>Điện thoại: 0123 456 789</p>
              <p>Email: contact@nhahangxyz.com</p>
            </div>
            <ReviewForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;