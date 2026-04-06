import { useState, useCallback } from 'react';
import { authApi } from '../../api/auth/authApi';
import type { ChangePasswordRequest } from '../../types/auth';

interface UseChangePasswordReturn {
  loading: boolean;
  success: boolean;
  error: string | null;
  handleChangePassword: (values: ChangePasswordRequest) => Promise<void>;
  reset: () => void;
}

/**
 * useChangePassword — business logic đổi mật khẩu.
 */
export function useChangePassword(): UseChangePasswordReturn {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleChangePassword = async (values: ChangePasswordRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authApi.changePassword(values);
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 400) {
        setError(msg ?? 'Mật khẩu hiện tại không đúng.');
      } else {
        setError('Có lỗi xảy ra, thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = useCallback(() => {
    setSuccess(false);
    setError(null);
  }, []);

  return { loading, success, error, handleChangePassword, reset };
}
