import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await authService.register({ email, password });
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.'
      );
    }
  };

  return (
    <div id="signup-content">
      <div className="signup-form">
        <h2>Đăng Ký</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-btn">Đăng Ký</button>
          <p>Đã có tài khoản? <Link to="/login">Đăng Nhập</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;