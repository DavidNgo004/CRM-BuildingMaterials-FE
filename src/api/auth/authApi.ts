import axiosClient from '../axiosClient';
import type {
  LoginRequest,
  LoginResponse,
  UserProfile,
  CreateStaffRequest,
  UpdateStaffRequest,
  ChangePasswordRequest,
  Staff,
} from '../../types/auth';

// ─── Auth API ─────────────────────────────────────────────────────────────────
// Tầng này chỉ chứa HTTP calls, không có business logic.
// Business logic nằm ở hooks (useLogin, useProfile, ...).
// ─────────────────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Đăng nhập — POST /login
   * Không yêu cầu token.
   */
  login: (data: LoginRequest) =>
    axiosClient.post<LoginResponse>('/login', data),

  /**
   * Lấy profile người dùng hiện tại — GET /profile
   */
  getProfile: () =>
    axiosClient.get<UserProfile>('/profile'),

  /**
   * Đổi mật khẩu — POST /change-password
   */
  changePassword: (data: ChangePasswordRequest) =>
    axiosClient.post<{ message: string }>('/change-password', data),

  /**
   * Tạo nhân viên kho (chỉ admin) — POST /create-staff
   */
  createStaff: (data: CreateStaffRequest) =>
    axiosClient.post<{ message: string; data: Staff }>('/create-staff', data),

  /**
   * Danh sách nhân viên kho — GET /staffs
   */
  getStaffs: () =>
    axiosClient.get<Staff[]>('/staffs'),

  /**
   * Cập nhật nhân viên — PUT /staffs/{id}
   */
  updateStaff: (id: number, data: UpdateStaffRequest) =>
    axiosClient.put<{ message: string; data: Staff }>(`/staffs/${id}`, data),

  /**
   * Xóa nhân viên — DELETE /staffs/{id}
   */
  deleteStaff: (id: number) =>
    axiosClient.delete<{ message: string }>(`/staffs/${id}`),
};
