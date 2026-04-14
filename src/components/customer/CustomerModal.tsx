import { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Row, Col } from 'antd';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../types/Admin/customer';

interface Props {
  open: boolean;
  editingCustomer: Customer | null;
  loading: boolean;
  onSubmit: (values: CreateCustomerRequest | UpdateCustomerRequest) => void;
  onClose: () => void;
}

export default function CustomerModal({ open, editingCustomer, loading, onSubmit, onClose }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingCustomer) {
        form.setFieldsValue({
          ...editingCustomer,
          status: !!editingCustomer.status,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          customer_type: 'retail',
          status: true,
        });
      }
    }
  }, [open, editingCustomer, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={editingCustomer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      width={600}
      okText={editingCustomer ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên khách hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
              ]}
            >
              <Input placeholder="0901234567" maxLength={10} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input placeholder="example@gmail.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="customer_type"
              label="Loại khách hàng"
            >
              <Select options={[
                { label: 'Khách bán lẻ', value: 'retail' },
                { label: 'Khách bán sỉ', value: 'wholesale' },
              ]} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Địa chỉ"
        >
          <Input.TextArea rows={2} placeholder="Số nhà, đường, phường/xã..." />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Ghi chú"
        >
          <Input.TextArea rows={2} placeholder="Thông tin thêm..." />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái hoạt động"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
