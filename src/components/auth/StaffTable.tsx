import { Table, Button, Tag, Popconfirm, Space, Tooltip, Typography } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  UnlockOutlined,
  LockOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Staff } from '../../types/auth';

const { Text } = Typography;

interface Props {
  staffs: Staff[];
  loading: boolean;
  onEdit: (staff: Staff) => void;
  onDelete: (id: number) => void;
  onToggleLock: (id: number) => void;
}

/**
 * StaffTable — Bảng danh sách nhân viên kho.
 * Hoàn toàn presentational, nhận data + callbacks từ parent.
 */
export default function StaffTable({ staffs, loading, onEdit, onDelete, onToggleLock }: Props) {
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
      title: 'Trạng thái',
      dataIndex: 'is_locked',
      key: 'is_locked',
      render: (is_locked: boolean) => (
        <Tag color={is_locked ? 'error' : 'success'} style={{ borderRadius: 20, padding: '2px 12px' }}>
          {is_locked ? 'Đã Khoá' : 'Hoạt động'}
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
          <Tooltip title={record.is_locked ? "Mở khoá" : "Khoá"}>
            <Popconfirm
              title={record.is_locked ? "Mở khoá tài khoản?" : "Khoá tài khoản?"}
              description={record.is_locked ? `Mở khoá tài khoản "${record.name}"?` : `Tài khoản "${record.name}" sẽ bị đăng xuất và không thể đăng nhập.`}
              onConfirm={() => onToggleLock(record.id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={!record.is_locked ? { danger: true } : {}}
              placement="topRight"
            >
              <Button
                type="text"
                icon={record.is_locked ? <UnlockOutlined /> : <LockOutlined />}
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
