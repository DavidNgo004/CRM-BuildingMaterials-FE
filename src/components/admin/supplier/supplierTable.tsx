import { Table, Button, Space, Tooltip, Typography, Popconfirm, Tag } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    ShopOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Supplier } from '../../../types/Admin/supplier';

const { Text } = Typography;

interface Props {
    suppliers: Supplier[];
    loading: boolean;
    onEdit: (supplier: Supplier) => void;
    onDelete: (id: number) => void;
}

export default function SupplierTable({ suppliers, loading, onEdit, onDelete }: Props) {
    const columns: ColumnsType<Supplier> = [
        {
            title: '#',
            dataIndex: 'id',
            width: 60,
            render: (_: any, __: any, index: number) => (
                <Text type="secondary">{index + 1}</Text>
            ),
        },
        {
            title: 'Nhà cung cấp',
            key: 'name_code',
            render: (_: any, record: Supplier) => (
                <Space direction="vertical" size={0}>
                    <Space>
                        <ShopOutlined style={{ color: '#6366f1' }} />
                        <Text strong>{record.name}</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: '12px', marginLeft: 22 }}>
                        Mã: {record.code}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Mã số thuế',
            dataIndex: 'tax_code',
            key: 'tax_code',
            render: (tax_code: string) => <Text>{tax_code || '—'}</Text>,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone: string) => (
                <Space>
                    <PhoneOutlined style={{ color: '#6366f1' }} />
                    <Text>{phone || '—'}</Text>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email?: string) => (
                email ? (
                    <Space>
                        <MailOutlined style={{ color: '#8b5cf6' }} />
                        <Text>{email}</Text>
                    </Space>
                ) : (
                    <Text type="secondary">—</Text>
                )
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
            render: (address: string) => (
                <Space>
                    <EnvironmentOutlined style={{ color: '#f59e0b' }} />
                    <Text>{address || '—'}</Text>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean) => (
                status ? (
                    <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: 20, padding: '2px 10px' }}>
                        Đang hợp tác
                    </Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error" style={{ borderRadius: 20, padding: '2px 10px' }}>
                        Đang tạm ngưng
                    </Tag>
                )
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date?: string) => (
                <Text type="secondary">
                    {date ? new Date(date).toLocaleDateString('vi-VN') : '—'}
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            align: 'center',
            render: (_: any, record: Supplier) => (
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
                            title="Xóa nhà cung cấp?"
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
            dataSource={suppliers}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: 800 }}
            locale={{ emptyText: 'Chưa có nhà cung cấp nào' }}
        />
    );
}