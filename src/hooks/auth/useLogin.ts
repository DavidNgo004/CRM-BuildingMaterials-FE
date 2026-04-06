import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth/authApi';
import { useAuth } from '../../store/authContext';
import type { LoginRequest } from '../../types/auth';

interface UseLoginReturn {
  loading: boolean;
  error: string | null;
  handleLogin: (values: LoginRequest) => Promise<void>;
}

/**
 * useLogin — xử lý toàn bộ business logic cho màn hình đăng nhập.
 * - Gọi API
 * - Lưu token + user qua AuthContext (đồng thời persist localStorage)
 * - Redirect theo role
 * - Quản lý loading / error state
 */
export function useLogin(): UseLoginReturn {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleLogin = async (values: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authApi.login(values);
      login(data.token, data.user);

      // Redirect theo role
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/staff/dashboard', { replace: true });
      }
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) {
        setError('Email hoặc mật khẩu không đúng.');
      } else if (status === 422) {
        setError('Dữ liệu nhập không hợp lệ.');
      } else if (status === 500) {
        setError('Server đang gặp sự cố, thử lại sau.');
      } else {
        setError('Không thể kết nối đến máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleLogin };
}
