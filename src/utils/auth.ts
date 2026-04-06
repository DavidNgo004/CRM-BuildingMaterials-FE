import type { User } from '../types/auth';

// ─── Storage Keys ────────────────────────────────────────────────────────────
const TOKEN_KEY = 'crm_access_token';
const USER_KEY  = 'crm_user';

// ─── Token ───────────────────────────────────────────────────────────────────

/**
 * Lưu JWT token vào localStorage.
 * Các module khác chỉ cần import `getToken()` để lấy token xác thực.
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Lấy JWT token từ localStorage.
 * Dùng cho axiosClient interceptor và bất kỳ module nào cần xác thực.
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// ─── Combined helpers ─────────────────────────────────────────────────────────

/** Lưu cả token và thông tin user sau khi đăng nhập thành công. */
export const saveAuth = (token: string, user: User): void => {
  saveToken(token);
  saveUser(user);
};

/** Xóa toàn bộ dữ liệu auth khỏi localStorage (logout). */
export const logout = (): void => {
  removeToken();
  removeUser();
};