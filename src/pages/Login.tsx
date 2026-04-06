import { Form, Input, Alert } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  ShopOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useLogin } from '../hooks/auth/useLogin';
import type { LoginRequest } from '../types/auth';
import '../styles/auth.css';

/**
 * Login Page — Entry point của ứng dụng CRM VLXD.
 *
 * Design: Dark glassmorphism với gradient deep purple/indigo.
 * Logic: Delegate hoàn toàn sang useLogin hook.
 */
export default function Login() {
  const { loading, error, handleLogin } = useLogin();
  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* ── Brand ── */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <ShopOutlined style={{ color: '#fff' }} />
          </div>
          <div className="auth-logo-text">
            <span className="auth-logo-name">CRM VLXD</span>
            <span className="auth-logo-sub">Vật liệu xây dựng</span>
          </div>
        </div>

        {/* ── Heading ── */}
        <div className="auth-heading">
          <h1>Đăng nhập</h1>
          <p>Chào mừng trở lại — vui lòng đăng nhập</p>
        </div>

        {/* ── Error ── */}
        {error && (
          <Alert
            className="auth-error"
            message={error}
            type="error"
            showIcon
          />
        )}

        {/* ── Form ── */}
        <Form<LoginRequest>
          onFinish={handleLogin}
          layout="vertical"
          size="large"
          autoComplete="on"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="nguyenvana@gmail.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {loading ? <LoadingOutlined /> : null}
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </Form.Item>
        </Form>

        {/* ── Footer ── */}
        <div className="auth-footer">
          © {new Date().getFullYear()} CRM VLXD — Hệ thống quản lý vật liệu xây dựng
        </div>
      </div>
    </div>
  );
}