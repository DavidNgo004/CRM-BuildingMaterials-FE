import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, AuthContextValue } from '../types/auth';
import { getToken, getUser, saveAuth, logout as clearAuth } from '../utils/auth';

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * AuthProvider — bọc toàn bộ app để cung cấp auth state global.
 *
 * Cách dùng ở các module khác:
 *   const { user, token, isAuthenticated, isAdmin } = useAuth();
 *
 * Token cũng được persist trong localStorage (key: crm_access_token)
 * để axiosClient interceptor đọc ra tự động cho mọi request.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser]   = useState<User | null>(() => getUser());

  // Đồng bộ state khi localStorage thay đổi từ tab khác
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getToken());
      setUser(getUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /** Gọi sau khi login thành công — lưu token + user vào cả state lẫn localStorage */
  const login = useCallback((newToken: string, newUser: User) => {
    saveAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  /** Xóa toàn bộ auth state và redirect về login */
  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAuth — hook để dùng auth state ở bất kỳ component/module nào.
 *
 * @example
 * const { user, token, isAuthenticated, isAdmin, logout } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
