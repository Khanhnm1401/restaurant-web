import React, { useState } from 'react';
import axios from 'axios';

function Booking() {
  const [people, setPeople] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await axios.post('http://localhost:8080/api/booking', { 
        people: parseInt(people), 
        date, 
        time 
      });
      setMessage('Đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      setPeople(1);
      setDate('');
      setTime('');
    } catch (err) {
      console.error('Booking error:', err);
      setMessage('Đặt bàn thất bại! Vui lòng thử lại.');
    }
    setLoading(false);
  };

  return (
    <div id="booking-container">
      <h1>Đặt Bàn</h1>
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '4px',
          backgroundColor: message.includes('thành công') ? '#d4edda' : '#f8d7da',
          color: message.includes('thành công') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('thành công') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Số người</label>
          <input
            type="number"
            min="1"
            max="20"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="form-group">
          <label>Thời gian</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="book-now" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đặt Ngay'}
        </button>
      </form>
    </div>
  );
}

export default Booking;