import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import type { User } from '../types/auth';

interface Props {
  children: React.ReactNode;
  /** Yêu cầu role cụ thể. Nếu không truyền → chỉ kiểm tra đã đăng nhập. */
  role?: User['role'];
  /** Redirect khi role không đủ quyền. Default: '/login' */
  redirectTo?: string;
}

/**
 * ProtectedRoute — Middleware guard cho React Router.
 *
 * Luồng kiểm tra:
 *   1. Chưa đăng nhập → redirect /login (kèm state.from để redirect lại sau)
 *   2. Không đủ role  → redirect /unauthorized (hoặc custom redirectTo)
 *   3. Đủ điều kiện   → render children
 *
 * Đọc auth state từ AuthContext (không gọi localStorage trực tiếp).
 *
 * @example
 * // Chỉ cần đăng nhập
 * <ProtectedRoute><Dashboard /></ProtectedRoute>
 *
 * // Chỉ admin
 * <ProtectedRoute role="admin"><StaffManagement /></ProtectedRoute>
 */
export default function ProtectedRoute({
  children,
  role,
  redirectTo = '/login',
}: Props) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Guard 1: Chưa xác thực → redirect về login, lưu lại URL hiện tại
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Guard 2: Yêu cầu role cụ thể mà không match → forbidden redirect
  if (role && user?.role !== role) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // Guard 3: Tất cả điều kiện thỏa → render
  return <>{children}</>;
}