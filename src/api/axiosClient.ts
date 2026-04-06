import axios from 'axios';
import { getToken, logout } from '../utils/auth';

/**
 * axiosClient — HTTP client dùng chung cho toàn bộ app.
 *
 * Token được đọc từ localStorage (key: crm_access_token) thông qua getToken().
 * Khi AuthContext gọi login() → lưu token vào localStorage →
 * interceptor này tự động đính kèm vào header của mọi request tiếp theo.
 *
 * Các module khác chỉ cần import axiosClient và gọi API, không cần
 * tự xử lý token thủ công.
 */

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Tự động đính kèm Bearer token (đọc từ localStorage) vào mọi request.

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Xử lý lỗi global: 401 → logout + redirect login.

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ → xóa auth data + redirect
      logout();
      window.location.replace('/login');
    }
    return Promise.reject(error);
  },
);

export default axiosClient;