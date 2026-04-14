import { Table, Button, Tag, Popconfirm, Space, Tooltip, Typography } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Customer } from '../../types/Admin/customer';

const { Text } = Typography;

interface Props {
  customers: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export default function CustomerTable({ customers, loading, onEdit, onDelete }: Props) {
  const columns: ColumnsType<Customer> = [
    {
      title: 'Mã KH',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Customer) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
        </Space>
      ),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string, record: Customer) => (
        <Space direction="vertical" size={0}>
          <Space size={4}>
            <PhoneOutlined style={{ fontSize: 12, color: '#16a34a' }} />
            <Text>{phone}</Text>
          </Space>
          <Space size={4}>
            <EnvironmentOutlined style={{ fontSize: 12, color: '#dc2626' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.address || '—'}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'customer_type',
      key: 'customer_type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'wholesale' ? 'purple' : 'cyan'}>
          {type === 'wholesale' ? 'Khách sỉ' : 'Khách lẻ'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: boolean) => (
        <Tag color={status ? 'success' : 'default'}>
          {status ? 'Hoạt động' : 'Tạm ngưng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_: any, record: Customer) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              style={{ color: '#6366f1' }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa khách hàng?"
              description={`Bạn có chắc muốn xóa "${record.name}" không?`}
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              placement="topRight"
            >
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={customers}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 800 }}
    />
  );
}
