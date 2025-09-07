import React, { useEffect, useState } from 'react';
import { userService } from '../../api/services';
import './Admin.css';

function Customers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.getAll({ page, limit: 10 });
      if (Array.isArray(res.data.users)) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setUsers(res.data);
        setTotalPages(1);
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Lỗi khi lấy danh sách khách hàng!'
      );
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page]);

  const tableStyles = {
    container: {
      width: '100%',
      overflowX: 'auto',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '600px'
    },
    th: {
      background: '#f8f9fa',
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#333',
      borderBottom: '2px solid #dee2e6'
    },
    td: {
      padding: '12px 16px',
      borderBottom: '1px solid #dee2e6',
      color: '#444'
    },
    tr: {
      '&:hover': {
        background: '#f8f9fa'
      }
    },
    emptyMessage: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
      fontSize: '16px'
    },
    errorMessage: {
      background: '#fff3f3',
      color: '#dc3545',
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '16px',
      border: '1px solid #ffcdd2'
    },
    loadingSpinner: {
      textAlign: 'center',
      padding: '40px',
      color: '#666'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20px',
      gap: '12px'
    },
    paginationButton: {
      padding: '8px 16px',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      background: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover:not(:disabled)': {
        background: '#f8f9fa',
        borderColor: '#adb5bd'
      },
      '&:disabled': {
        background: '#f8f9fa',
        cursor: 'not-allowed',
        opacity: 0.6
      }
    },
    pageInfo: {
      color: '#666',
      fontSize: '14px'
    }
  };

  return (
    <div className="admin-container">
      <h2 style={{ color: '#333', marginBottom: '24px' }}>Danh sách khách hàng</h2>
      
      {error && (
        <div style={tableStyles.errorMessage}>
          <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
          {error}
        </div>
      )}

      {loading ? (
        <div style={tableStyles.loadingSpinner}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginRight: '12px' }}></i>
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <div style={tableStyles.container}>
            <table style={tableStyles.table}>
              <thead>
                <tr>
                  <th style={tableStyles.th}>Email</th>
                  <th style={tableStyles.th}>Vai trò</th>
                  <th style={tableStyles.th}>Tổng đơn</th>
                  <th style={tableStyles.th}>Tổng chi tiêu</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={tableStyles.emptyMessage}>
                      <i className="fas fa-users" style={{ fontSize: '24px', marginBottom: '12px', display: 'block' }}></i>
                      Không có khách hàng nào.
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} style={tableStyles.tr}>
                      <td style={tableStyles.td}>{u.email}</td>
                      <td style={tableStyles.td}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: u.role === 'admin' ? '#e3f2fd' : '#f5f5f5',
                          color: u.role === 'admin' ? '#1976d2' : '#666'
                        }}>
                          {u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                        </span>
                      </td>
                      <td style={tableStyles.td}>{u.totalOrders ?? 0}</td>
                      <td style={tableStyles.td}>
                        <span style={{ fontWeight: '500', color: '#28a745' }}>
                          {(u.totalSpent ?? 0).toLocaleString()} VNĐ
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button 
              className={`paginationButton${page === 1 ? '' : ''}`}
              onClick={() => setPage(page - 1)} 
              disabled={page === 1 || loading}
            >
              <i className="fas fa-chevron-left" style={{ marginRight: '4px' }}></i>
              Trang trước
            </button>
            <span className="pageInfo">
              Trang {page} / {totalPages}
            </span>
            <button 
              className={`paginationButton${page === totalPages ? ' active' : ''}`}
              onClick={() => setPage(page + 1)} 
              disabled={page === totalPages || loading}
            >
              Trang tiếp
              <i className="fas fa-chevron-right" style={{ marginLeft: '4px' }}></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Customers; 