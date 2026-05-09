import { Form, Input, Alert } from 'antd';
import favicon from '../../assets/favicon.png';
import { MailOutlined, LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth/authApi';
import type { ForgotPasswordRequest } from '../../types/auth';
import '../../styles/auth.css';

export default function ForgotPassword() {
  const [form] = Form.useForm<ForgotPasswordRequest>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Quên mật khẩu - CRM VLXD';
  }, []);

  const handleFinish = async (values: ForgotPasswordRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await authApi.forgotPassword(values);
      setSuccess(response.data.message);
      form.resetFields();
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
          <h1>Quên mật khẩu</h1>
          <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>
        </div>

        {/* ── Error & Success ── */}
        {error && (
          <Alert className="auth-error" message={error} type="error" showIcon />
        )}
        {success && (
          <Alert style={{ marginBottom: 24 }} message={success} type="success" showIcon />
        )}

        {/* ── Form ── */}
        <Form<ForgotPasswordRequest>
          form={form}
          onFinish={handleFinish}
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
              prefix={<MailOutlined />}
              placeholder="nguyenvana@gmail.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16, marginTop: 8 }}>
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
              {loading ? 'Đang gửi...' : 'Gửi liên kết'}
            </button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#1890ff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <ArrowLeftOutlined /> Quay lại đăng nhập
            </Link>
          </div>
        </Form>

        {/* ── Footer ── */}
        <div className="auth-footer">
          © {new Date().getFullYear()} CRM VLXD — Hệ thống quản lý vật liệu xây dựng
        </div>
      </div>
    </div>
  );
}
