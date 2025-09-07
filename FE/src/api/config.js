const API_URL = 'http://localhost:8080/api'; // Đúng với backend của bạn

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/signup`,
  
  // Menu
  MENU: `${API_URL}/admin/menu`,
  MENU_ITEM: (id) => `${API_URL}/admin/menu/${id}`,
  
  // Orders/Bills
  ORDERS: `${API_URL}/admin/orders`,
  ORDER: (id) => `${API_URL}/admin/orders/${id}`,
  
  // Customers
  CUSTOMERS: `${API_URL}/admin/users`,
  CUSTOMER: (id) => `${API_URL}/admin/users/${id}`,
  
  // Statistics
  STATISTICS: `${API_URL}/admin/revenue`,
  
  // Admin
  ADD_MENU_ITEM: `${API_URL}/admin/add-item`,
  USERS: `${API_URL}/admin/users`,
  ALL_USERS: `${API_URL}/admin/all-users`,
  BOOKINGS: `${API_URL}/admin/bookings`,
  REVENUE: `${API_URL}/admin/revenue`,
  PUBLIC_MENU: `${API_URL}/menu`,
  PAYMENT_CREATE_ORDER: `${API_URL}/payment/create-order`,
  PAYMENT_PAY: `${API_URL}/payment/pay`,
  PAYMENT_UPDATE_STATUS: (orderId) => `${API_URL}/payment/update-payment-status/${orderId}`,
  REVENUE_BY_DAY: (date) => `${API_URL}/admin/revenue-by-day?date=${date}`,
  REVENUE_BY_MONTH: (month) => `${API_URL}/admin/revenue-by-month?month=${month}`,
  USER_ORDERS: (userId) => `${API_URL}/payment/user-orders/${userId}`,
  
  // Reviews
  REVIEWS: `${API_URL}/admin/reviews`,
  REVIEW_CHECK: (id) => `${API_URL}/admin/reviews/${id}/check`,
  SUBMIT_REVIEW: `${API_URL}/review`,
  
  // Booking - Thêm các endpoint booking
  BOOKING: `${API_URL}/booking`,
  ACCEPT_BOOKING: (id) => `${API_URL}/admin/bookings/${id}/accept`,
  REJECT_BOOKING: (id) => `${API_URL}/admin/bookings/${id}/reject`,
  DELETE_BOOKING: (id) => `${API_URL}/admin/bookings/${id}`,
};

export default API_URL;