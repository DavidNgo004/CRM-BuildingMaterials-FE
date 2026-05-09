import { Form, Input, Alert } from 'antd';
import favicon from '../../assets/favicon.png';
import { LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api/auth/authApi';
import type { ResetPasswordRequest } from '../../types/auth';
import '../../styles/auth.css';

export default function ResetPassword() {
  const [form] = Form.useForm<ResetPasswordRequest>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    document.title = 'Đặt lại mật khẩu - CRM VLXD';
    if (!token || !email) {
      setError('Đường dẫn không hợp lệ. Thiếu token hoặc email.');
    }
  }, [token, email]);

  const handleFinish = async (values: any) => {
    if (!token || !email) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const payload: ResetPasswordRequest = {
        token,
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };
      
      const response = await authApi.resetPassword(payload);
      setSuccess(response.data.message);
      
      // Tự động chuyển về trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* ── Brand ── */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <img src={favicon} className="auth-logo-img" alt="Logo" />
          </div>
          <div className="auth-logo-text">
            <span className="auth-logo-name">CRM VLXD</span>
            <span className="auth-logo-sub">Vật liệu xây dựng</span>
          </div>
        </div>

        {/* ── Heading ── */}
        <div className="auth-heading">
          <h1>Đặt lại mật khẩu</h1>
          <p>Vui lòng nhập mật khẩu mới cho tài khoản {email}</p>
        </div>

        {/* ── Error & Success ── */}
        {error && (
          <Alert className="auth-error" message={error} type="error" showIcon />
        )}
        {success && (
          <Alert style={{ marginBottom: 24 }} message={`${success} Đang chuyển hướng về trang đăng nhập...`} type="success" showIcon />
        )}

        {/* ── Form ── */}
        {!success && (
          <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            size="large"
            autoComplete="on"
            disabled={!token || !email}
          >
            <Form.Item
              name="password"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Form.Item>
            
            <Form.Item
              name="password_confirmation"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16, marginTop: 8 }}>
              <button
                type="submit"
                className="auth-btn"
                disabled={loading || !token || !email}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: (loading || !token || !email) ? 'not-allowed' : 'pointer',
                  border: 'none',
                }}
              >
                {loading ? <LoadingOutlined /> : null}
                {loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
              </button>
            </Form.Item>
            
            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#1890ff', textDecoration: 'none' }}>
                Hủy bỏ
              </Link>
            </div>
          </Form>
        )}

        {/* ── Footer ── */}
        <div className="auth-footer">
          © {new Date().getFullYear()} CRM VLXD — Hệ thống quản lý vật liệu xây dựng
        </div>
      </div>
    </div>
  );
}
