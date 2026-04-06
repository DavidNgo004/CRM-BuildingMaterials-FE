import { Modal, Form, Input, Button, Alert } from 'antd';
import type { Staff, CreateStaffRequest, UpdateStaffRequest } from '../../types/auth';

interface Props {
  open: boolean;
  editingStaff: Staff | null;
  loading: boolean;
  error: string | null;
  onSubmit: (values: CreateStaffRequest | UpdateStaffRequest) => void;
  onClose: () => void;
}

/**
 * StaffFormModal — Modal tạo mới / chỉnh sửa nhân viên kho.
 * Hoàn toàn controlled, không chứa business logic.
 */
export default function StaffFormModal({
  open,
  editingStaff,
  loading,
  error,
  onSubmit,
  onClose,
}: Props) {
  const [form] = Form.useForm();
  const isEditing = !!editingStaff;

  const handleOk = () => form.submit();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={isEditing ? 'Chỉnh sửa nhân viên' : 'Tạo nhân viên kho'}
      onOk={handleOk}
      onCancel={handleClose}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          {isEditing ? 'Cập nhật' : 'Tạo mới'}
        </Button>,
      ]}
      destroyOnHidden
    >
      {error && (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
      )}

      <Form
        form={form}
        layout="vertical"
        initialValues={editingStaff ?? {}}
        onFinish={onSubmit}
        key={editingStaff?.id ?? 'create'}
      >
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="nhanvien@crm.vn" />
        </Form.Item>

        {!isEditing && (
          <>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
              ]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="password_confirmation"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
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
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}
