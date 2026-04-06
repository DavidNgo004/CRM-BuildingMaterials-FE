// ─── Auth Requests ────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateStaffRequest {
  name?: string;
  email?: string;
}

// ─── Auth Responses ───────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'warehouse_staff';
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UserProfile {
  name: string;
  email: string;
}

export type Staff = User;

// ─── Auth Context ─────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}