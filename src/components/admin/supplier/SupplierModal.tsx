import { Modal, Form, Input, Button, Select } from 'antd';
import type { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../../../types/Admin/supplier';

interface Props {
  open: boolean;
  editingSupplier: Supplier | null;
  loading: boolean;
  onSubmit: (values: CreateSupplierRequest | UpdateSupplierRequest) => void;
  onClose: () => void;
}

export default function SupplierModal({
  open,
  editingSupplier,
  loading,
  onSubmit,
  onClose,
}: Props) {
  const [form] = Form.useForm();
  const isEditing = !!editingSupplier;

  const handleOk = () => form.submit();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={isEditing ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
      onOk={handleOk}
      onCancel={handleClose}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          {isEditing ? 'Cập nhật' : 'Thêm mới'}
        </Button>,
      ]}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={editingSupplier ?? { status: true }}
        onFinish={onSubmit}
        key={editingSupplier?.id ?? 'create'}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="Tên nhà cung cấp"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
        >
          <Input placeholder="Công ty VLXD ABC" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            label="Mã số thuế"
            name="tax_code"
          >
            <Input placeholder="0123456789" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
            ]}
          >
            <Input placeholder="0901234567" />
          </Form.Item>
        </div>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input placeholder="contact@abc.vn" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true }]}
        >
          <Select options={[
            { label: 'Đang hợp tác', value: true },
            { label: 'Đang tạm ngưng', value: false },
          ]} />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input.TextArea placeholder="Số 10, Đường X, Phường Y, Quận Z..." rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}