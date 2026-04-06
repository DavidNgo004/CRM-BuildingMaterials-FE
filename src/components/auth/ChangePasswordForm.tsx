import { Form, Input, Button, Alert } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ChangePasswordRequest } from '../../types/auth';

interface Props {
  loading: boolean;
  success: boolean;
  error: string | null;
  onSubmit: (values: ChangePasswordRequest) => void;
  onReset: () => void;
}

/**
 * ChangePasswordForm — Form đổi mật khẩu thuần UI.
 */
export default function ChangePasswordForm({ loading, success, error, onSubmit, onReset }: Props) {
  const [form] = Form.useForm<ChangePasswordRequest>();

  const handleFinish = (values: ChangePasswordRequest) => {
    onSubmit(values);
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <CheckCircleOutlined style={{ fontSize: 48, color: '#22c55e', marginBottom: 16 }} />
        <p style={{ fontSize: 16, color: '#4ade80', marginBottom: 24 }}>
          Đổi mật khẩu thành công!
        </p>
        <Button onClick={() => { form.resetFields(); onReset(); }}>
          Đổi lại
        </Button>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 420 }}
    >
      {error && (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
      )}

      <Form.Item
        label="Mật khẩu hiện tại"
        name="current_password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="••••••••"
        />
      </Form.Item>

      <Form.Item
        label="Mật khẩu mới"
        name="password"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu mới' },
          { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="••••••••"
        />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu mới"
        name="password_confirmation"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="••••••••"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          Cập nhật mật khẩu
        </Button>
      </Form.Item>
    </Form>
  );
}
