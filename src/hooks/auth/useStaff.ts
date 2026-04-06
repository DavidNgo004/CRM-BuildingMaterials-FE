import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../../api/auth/authApi';
import type { Staff, CreateStaffRequest, UpdateStaffRequest } from '../../types/auth';

interface UseStaffReturn {
  staffs: Staff[];
  loading: boolean;
  error: string | null;
  fetchStaffs: () => Promise<void>;
  createStaff: (data: CreateStaffRequest) => Promise<boolean>;
  updateStaff: (id: number, data: UpdateStaffRequest) => Promise<boolean>;
  deleteStaff: (id: number) => Promise<boolean>;
}

/**
 * useStaff — CRUD nhân viên kho (chỉ admin).
 * Trả về staffs list + các action functions.
 * Mọi action đều trả về boolean (success/fail) để UI quyết định đóng modal.
 */
export function useStaff(): UseStaffReturn {
  const [staffs, setStaffs]   = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchStaffs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.getStaffs();
      setStaffs(data);
    } catch {
      setError('Không thể tải danh sách nhân viên.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffs();
  }, [fetchStaffs]);

  const createStaff = async (data: CreateStaffRequest): Promise<boolean> => {
    try {
      await authApi.createStaff(data);
      await fetchStaffs();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Tạo nhân viên thất bại.';
      setError(msg);
      return false;
    }
  };

  const updateStaff = async (id: number, data: UpdateStaffRequest): Promise<boolean> => {
    try {
      await authApi.updateStaff(id, data);
      await fetchStaffs();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Cập nhật nhân viên thất bại.';
      setError(msg);
      return false;
    }
  };

  const deleteStaff = async (id: number): Promise<boolean> => {
    try {
      await authApi.deleteStaff(id);
      setStaffs((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Xóa nhân viên thất bại.';
      setError(msg);
      return false;
    }
  };

  return { staffs, loading, error, fetchStaffs, createStaff, updateStaff, deleteStaff };
}
