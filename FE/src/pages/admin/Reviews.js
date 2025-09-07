import React, { useState, useEffect } from 'react';
import { reviewService } from '../../api/services';
import './Reviews.css';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getAll();
      setReviews(response.data);
      console.log('Reviews data:', response.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async (id) => {
    try {
      await reviewService.checkReview(id);
      fetchReviews();
      setError('');
    } catch (err) {
      setError('Không thể cập nhật trạng thái đánh giá');
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <h2>Quản lý đánh giá</h2>
      
      {error && <div className="error-message">{error}</div>}

      <table className="reviews-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Ngày gửi</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.name}</td>
              <td>{review.email}</td>
              <td>
                <span className={`status-badge ${review.checked ? 'checked' : 'unchecked'}`}>
                  {review.checked ? "Đã kiểm tra" : "Chưa kiểm tra"}
                </span>
              </td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-view"
                  onClick={() => handleViewDetails(review)}
                >
                  Xem
                </button>
                {!review.checked && (
                  <button
                    className="btn btn-check"
                    onClick={() => handleCheck(review.id)}
                  >
                    Kiểm tra
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chi tiết đánh giá</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedReview && (
                <div>
                  <p><strong>Tên:</strong> {selectedReview.name}</p>
                  <p><strong>Email:</strong> {selectedReview.email}</p>
                  <p><strong>Ngày gửi:</strong> {new Date(selectedReview.createdAt).toLocaleString()}</p>
                  <p><strong>Nội dung:</strong></p>
                  <div className="review-message">
                    {selectedReview.message}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-close" onClick={() => setShowModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews; 