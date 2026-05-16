import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import type { Expense, ExpenseFormData } from '../../../types/Admin/expense';

interface ExpenseFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: Expense | null;
  loading?: boolean;
}

const COMMON_EXPENSES = [
  'Chi phí lương nhân viên',
  'Chi phí điện nước',
  'Chi phí thuê mặt bằng',
  'Chi phí marketing/quảng cáo',
  'Chi phí văn phòng phẩm',
  'Chi phí vận chuyển',
  'Khác'
];

export default function ExpenseFormModal({
  open,
  onCancel,
  onSubmit,
  initialData,
  loading
}: ExpenseFormModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          title: initialData.title,
          amount: initialData.amount,
          expense_date: dayjs(initialData.expense_date),
          note: initialData.note,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ expense_date: dayjs() });
      }
    }
  }, [open, initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        expense_date: values.expense_date.format('YYYY-MM-DD'),
      });
    });
  };

  return (
    <Modal
      title={initialData ? 'Sửa Khoản Chi' : 'Thêm Khoản Chi Mới'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Loại / Tiêu đề chi phí"
          rules={[{ required: true, message: 'Vui lòng nhập hoặc chọn tiêu đề chi phí' }]}
        >
          <Select
            mode="tags"
            maxCount={1}
            placeholder="Chọn hoặc nhập loại chi phí mới..."
            options={COMMON_EXPENSES.map(item => ({ value: item, label: item }))}
          />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Số tiền (VNĐ)"
          rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
            min={0}
            placeholder="Ví dụ: 5000000"
          />
        </Form.Item>

        <Form.Item
          name="expense_date"
          label="Ngày chi"
          rules={[{ required: true, message: 'Vui lòng chọn ngày chi' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="note"
          label="Ghi chú"
        >
          <Input.TextArea rows={3} placeholder="Mô tả thêm về khoản chi..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
