import { Table, Button, Tag, Popconfirm, Space, Tooltip, Typography } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Staff } from '../../types/auth';

const { Text } = Typography;

interface Props {
  staffs: Staff[];
  loading: boolean;
  onEdit: (staff: Staff) => void;
  onDelete: (id: number) => void;
}

/**
 * StaffTable — Bảng danh sách nhân viên kho.
 * Hoàn toàn presentational, nhận data + callbacks từ parent.
 */
export default function StaffTable({ staffs, loading, onEdit, onDelete }: Props) {
  const columns: ColumnsType<Staff> = [
    {
      title: '#',
      dataIndex: 'id',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Text type="secondary">{index + 1}</Text>
      ),
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <UserOutlined style={{ color: '#6366f1' }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <Space>
          <MailOutlined style={{ color: '#8b5cf6' }} />
          <Text>{email}</Text>
        </Space>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (_role: string) => (
        <Tag color="purple" style={{ borderRadius: 20, padding: '2px 12px' }}>
          Nhân viên kho
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString('vi-VN')}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_: any, record: Staff) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              style={{ color: '#6366f1' }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa nhân viên?"
              description={`Bạn có chắc muốn xóa "${record.name}" không?`}
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              placement="topRight"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={staffs}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10, showSizeChanger: false }}
      scroll={{ x: 600 }}
      locale={{ emptyText: 'Chưa có nhân viên kho nào' }}
    />
  );
}
