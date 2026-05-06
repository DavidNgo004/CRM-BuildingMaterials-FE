import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, Tooltip, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Expense } from '../../../types/Admin/expense';

interface ExpenseTableProps {
  data: Expense[];
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  'lương': 'geekblue',
  'điện nước': 'cyan',
  'thuê': 'purple',
  'marketing': 'magenta',
  'quảng cáo': 'magenta',
  'vận chuyển': 'orange',
  'văn phòng': 'gold',
  'khác': 'default',
};

function getCategoryColor(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return 'blue';
}

export default function ExpenseTable({
  data,
  loading,
  onEdit,
  onDelete,
  pagination,
}: ExpenseTableProps) {
  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (id: number) => (
        <span style={{ color: '#8c8c8c', fontSize: '13px' }}>#{id}</span>
      ),
    },
    {
      title: 'Loại / Tiêu đề chi phí',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Space>
          <Tag
            color={getCategoryColor(text)}
            style={{ borderRadius: 6, fontWeight: 500, margin: 0 }}
          >
            {text}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: 700, color: '#cf1322', fontSize: '14px' }}>
          {formatVND(amount)}
        </span>
      ),
      sorter: (a: Expense, b: Expense) => Number(a.amount) - Number(b.amount),
    },
    {
      title: 'Ngày chi',
      dataIndex: 'expense_date',
      key: 'expense_date',
      render: (date: string) => (
        <span style={{ color: '#595959' }}>
          {dayjs(date).format('DD/MM/YYYY')}
        </span>
      ),
      sorter: (a: Expense, b: Expense) =>
        dayjs(a.expense_date).unix() - dayjs(b.expense_date).unix(),
    },
    {
      title: 'Người tạo',
      key: 'user',
      render: (_: any, record: Expense) => {
        const user = record.user;
        if (user && user.name) {
          return (
            <Space>
              <Avatar size="small" style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <span style={{ fontSize: '13px', color: '#595959' }}>{user.name}</span>
            </Space>
          );
        }
        return <span style={{ color: '#bfbfbf', fontSize: '13px' }}>Không rõ</span>;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (note: string | null) =>
        note ? (
          <span style={{ color: '#595959', fontSize: '13px' }}>{note}</span>
        ) : (
          <span style={{ color: '#bfbfbf', fontSize: '13px' }}>—</span>
        ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: any, record: Expense) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#6366f1' }} />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa khoản chi"
              description="Bạn có chắc chắn muốn xóa khoản chi này?"
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
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
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      scroll={{ x: 900 }}
      style={{ borderRadius: 8, overflow: 'hidden' }}
    />
  );
}
