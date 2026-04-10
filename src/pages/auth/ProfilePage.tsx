import { Card, Descriptions, Tag, Typography, Divider, Space, Avatar } from 'antd';
import { UserOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuth } from '../../store/authContext';
import { useChangePassword } from '../../hooks/auth/useChangePassword';
import { useNavigate } from 'react-router-dom';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import '../../styles/auth.css';

const { Title, Text } = Typography;

/**
 * ProfilePage — Trang thông tin cá nhân + đổi mật khẩu.
 * Accessible bởi cả admin và warehouse_staff.
 */
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const changePwd = useChangePassword();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  const roleLabel = user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên kho';
  const roleColor = user.role === 'admin' ? 'gold' : 'purple';

  return (
    <DashboardLayout userName={user?.name ?? 'Admin'} onLogout={handleLogout}>
      <div className="auth-inner-page auth-inner-page-card">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>

          {/* ── Profile Card ── */}
          <Card
            style={{ flex: '1 1 320px', borderRadius: 16 }}
            styles={{ body: { padding: 32 } }}
          >
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    marginBottom: 16,
                    fontSize: 36,
                  }}
                />
                <Title level={4} style={{ margin: '0 0 4px' }}>
                  {user.name}
                </Title>
                <Tag color={roleColor} style={{ borderRadius: 20 }}>
                  {roleLabel}
                </Tag>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <Descriptions column={1} size="small" labelStyle={{ color: '#8c8c8c' }}>
                <Descriptions.Item
                  label={<><UserOutlined /> Họ tên</>}
                >
                  <Text strong>{user.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<><MailOutlined /> Email</>}
                >
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<><SafetyOutlined /> Vai trò</>}
                >
                  <Tag color={roleColor}>{roleLabel}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {new Date(user.created_at).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>

          {/* ── Change Password Card ── */}
          <Card
            title={
              <Space>
                <SafetyOutlined style={{ color: '#6366f1' }} />
                Đổi mật khẩu
              </Space>
            }
            style={{ flex: '1 1 360px', borderRadius: 16 }}
            styles={{ body: { padding: 32 } }}
          >
            <ChangePasswordForm
              loading={changePwd.loading}
              success={changePwd.success}
              error={changePwd.error}
              onSubmit={changePwd.handleChangePassword}
              onReset={changePwd.reset}
            />
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}
