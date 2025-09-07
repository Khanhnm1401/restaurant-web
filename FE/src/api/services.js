import axios from 'axios';
import { API_ENDPOINTS } from './config';


const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authService = {
  login: (credentials) => api.post(API_ENDPOINTS.LOGIN, credentials),
  register: (userData) => api.post(API_ENDPOINTS.REGISTER, userData),
};

// Menu (Admin)
export const menuService = {
  getAll: () => api.get(API_ENDPOINTS.MENU),
  addItem: (item) => api.post(API_ENDPOINTS.ADD_MENU_ITEM, item),
  deleteItem: (id) => api.delete(API_ENDPOINTS.MENU_ITEM(id)),
  updateItem: (id, item) => api.put(API_ENDPOINTS.MENU_ITEM(id), item),
  // Nếu có route lấy danh sách món ăn, thêm ở đây
};

// Users (Admin)
export const userService = {
  getAll: ({ page, limit }) => api.get(API_ENDPOINTS.ALL_USERS + `?page=${page}&limit=${limit}`),
  getAllNoPaging: () => api.get(API_ENDPOINTS.ALL_USERS),
};

// Bookings (Admin)
export const bookingService = {
  getAll: (params) => api.get(API_ENDPOINTS.BOOKINGS, { params }),
  accept: (id) => api.put(API_ENDPOINTS.ACCEPT_BOOKING(id)),
  reject: (id) => api.put(API_ENDPOINTS.REJECT_BOOKING(id)),
  delete: (id) => api.delete(API_ENDPOINTS.DELETE_BOOKING(id)),
  // Thêm method để user đặt bàn
  create: (bookingData) => api.post(API_ENDPOINTS.BOOKING, bookingData),
};

// Orders (Admin)
export const orderService = {
  getAll: (params) => api.get(API_ENDPOINTS.ORDERS, { params }),
  getById: (id) => api.get(API_ENDPOINTS.ORDER(id)),
  getUserOrders: (userId) => api.get(API_ENDPOINTS.USER_ORDERS(userId)),
};

// Statistics (Admin)
export const statisticsService = {
  getRevenue: () => api.get(API_ENDPOINTS.REVENUE),
  getRevenueByDay: (date) => api.get(API_ENDPOINTS.REVENUE_BY_DAY(date)),
  getRevenueByMonth: (month) => api.get(API_ENDPOINTS.REVENUE_BY_MONTH(month)),
};

export const publicMenuService = {
  getAll: () => axios.get(API_ENDPOINTS.PUBLIC_MENU),
};

export const paymentService = {
  createOrder: (orderData) => api.post(API_ENDPOINTS.PAYMENT_CREATE_ORDER, orderData),
  payOrder: (payData) => api.post(API_ENDPOINTS.PAYMENT_PAY, payData),
  updatePaymentStatus: (orderId, data) => api.put(API_ENDPOINTS.PAYMENT_UPDATE_STATUS(orderId), data),
};

// Reviews
export const reviewService = {
  getAll: () => api.get(API_ENDPOINTS.REVIEWS),
  checkReview: (id) => api.put(API_ENDPOINTS.REVIEW_CHECK(id)),
  submitReview: (reviewData) => api.post(API_ENDPOINTS.SUBMIT_REVIEW, reviewData),
};
