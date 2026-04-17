import { Table, Tag, Button, Space, Tooltip, Popconfirm, Typography } from 'antd';
import {
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    CheckOutlined,
    EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Import, ImportStatus } from '../../../types/Admin/import';

const { Text } = Typography;

const STATUS_CONFIG: Record<ImportStatus, { color: string; label: string }> = {
    pending: { color: 'orange', label: 'Chờ duyệt' },
    approved: { color: 'blue', label: 'Đã duyệt' },
    completed: { color: 'success', label: 'Hoàn thành' },
    cancelled: { color: 'default', label: 'Đã hủy' },
};

interface Props {
    imports: Import[];
    loading: boolean;
    onView: (record: Import) => void;
    onEdit: (record: Import) => void;
    onApprove: (id: number) => Promise<any> | void;
    onComplete: (id: number) => Promise<any> | void;
    onCancel: (id: number) => Promise<any> | void;
    onDelete: (id: number) => Promise<any> | void;
}

const formatVnd = (val: number | string) => {
    const num = typeof val === 'number' ? val : Number(val);
    if (isNaN(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

export default function ImportTable({
    imports, loading, onView, onEdit, onApprove, onComplete, onCancel, onDelete,
}: Props) {
    const columns: ColumnsType<Import> = [
        {
            title: 'Mã phiếu',
            dataIndex: 'code',
            key: 'code',
            width: 130,
            render: (code: string) => <Tag color="geekblue">{code}</Tag>,
        },
        {
            title: 'Người lập',
            dataIndex: ['user', 'name'],
            key: 'user',
            render: (_: any, record: Import) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.user?.name ?? '—'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.user?.email ?? ''}</Text>
                </Space>
            ),
        },
        {
            title: 'Số SP',
            key: 'num_details',
            width: 100,
            align: 'center',
            render: (_: any, record: Import) => (
                <Tag>{record.details?.length ?? 0} SP</Tag>
            ),
        },
        {
            title: 'Tổng tiền hàng',
            dataIndex: 'total_price',
            key: 'total_price',
            align: 'right',
            render: (val: number) => <Text>{formatVnd(val)}</Text>,
        },
        {
            title: 'Chiết khấu',
            dataIndex: 'discount_amount',
            key: 'discount_amount',
            align: 'right',
            render: (val: number) => (
                <Text type={val > 0 ? 'success' : 'secondary'}>
                    {val > 0 ? `-${formatVnd(val)}` : '—'}
                </Text>
            ),
        },
        {
            title: 'Thanh toán',
            dataIndex: 'grand_total',
            key: 'grand_total',
            align: 'right',
            render: (val: number) => (
                <Text strong style={{ color: '#6366f1' }}>{formatVnd(val)}</Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Chờ duyệt', value: 'pending' },
                { text: 'Đã duyệt', value: 'approved' },
                { text: 'Hoàn thành', value: 'completed' },
                { text: 'Đã hủy', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: ImportStatus) => {
                const cfg = STATUS_CONFIG[status] ?? { color: 'default', label: status };
                return <Tag color={cfg.color}>{cfg.label}</Tag>;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 170,
            render: (val: string) =>
                new Date(val).toLocaleString('vi-VN'),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 160,
            align: 'center',
            render: (_: any, record: Import) => {
                const isPending = record.status === 'pending';
                const isApproved = record.status === 'approved';
                const isDone = record.status === 'completed' || record.status === 'cancelled';

                return (
                    <Space>
                        {/* Xem chi tiết */}
                        <Tooltip title="Xem chi tiết">
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                onClick={() => onView(record)}
                                style={{ color: '#6366f1' }}
                            />
                        </Tooltip>

                        {/* Chỉnh sửa (chỉ pending) */}
                        {isPending && (
                            <Tooltip title="Chỉnh sửa phiếu">
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => onEdit(record)}
                                    style={{ color: '#0ea5e9' }}
                                />
                            </Tooltip>
                        )}

                        {/* Duyệt phiếu */}
                        {isPending && (
                            <Tooltip title="Duyệt phiếu">
                                <Popconfirm
                                    title="Duyệt phiếu nhập?"
                                    description="Hệ thống sẽ gửi email đặt hàng đến nhà cung cấp."
                                    onConfirm={() => onApprove(record.id)}
                                    okText="Duyệt"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        type="text"
                                        icon={<CheckCircleOutlined />}
                                        style={{ color: '#16a34a' }}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        )}

                        {/* Hoàn thành */}
                        {isApproved && (
                            <Tooltip title="Xác nhận hàng đã về">
                                <Popconfirm
                                    title="Xác nhận hàng đã về kho?"
                                    description="Tồn kho sẽ được cập nhật tự động."
                                    onConfirm={() => onComplete(record.id)}
                                    okText="Xác nhận"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        type="text"
                                        icon={<CheckOutlined />}
                                        style={{ color: '#0ea5e9' }}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        )}

                        {/* Hủy phiếu */}
                        {!isDone && (
                            <Tooltip title="Hủy phiếu">
                                <Popconfirm
                                    title="Hủy phiếu nhập?"
                                    onConfirm={() => onCancel(record.id)}
                                    okText="Hủy phiếu"
                                    cancelText="Không"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button
                                        type="text"
                                        icon={<CloseCircleOutlined />}
                                        danger
                                    />
                                </Popconfirm>
                            </Tooltip>
                        )}

                        {/* Xóa vĩnh viễn (chỉ pending) */}
                        {isPending && (
                            <Tooltip title="Xóa phiếu">
                                <Popconfirm
                                    title="Xóa phiếu nhập?"
                                    description="Hành động này không thể hoàn tác."
                                    onConfirm={() => onDelete(record.id)}
                                    okText="Xóa"
                                    cancelText="Không"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button type="text" icon={<DeleteOutlined />} danger />
                                </Popconfirm>
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={imports}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} phiếu` }}
            scroll={{ x: 1100 }}
            rowClassName={(record) =>
                record.status === 'cancelled' ? 'ant-table-row-cancelled' : ''
            }
        />
    );
}
