import { Table, Tag, Button, Space, Tooltip, Popconfirm, Typography } from 'antd';
import {
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Export, ExportStatus } from '../../types/Admin/export';

const { Text } = Typography;

const STATUS_CONFIG: Record<ExportStatus, { color: string; label: string }> = {
    pending: { color: 'orange', label: 'Chờ xử lý' },
    approved: { color: 'blue', label: 'Đã duyệt' },
    completed: { color: 'success', label: 'Hoàn thành' },
    cancelled: { color: 'default', label: 'Đã hủy' },
};

const formatVnd = (val: number | string) => {
    const num = typeof val === 'number' ? val : Number(val);
    if (isNaN(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

interface Props {
    exports: Export[];
    loading: boolean;
    onView: (record: Export) => void;
    onApprove: (id: number) => Promise<any> | void;
    onComplete: (id: number) => Promise<any> | void;
    onCancel: (id: number) => Promise<any> | void;
    onDelete: (id: number) => Promise<any> | void;
}

export default function ExportTable({
    exports, loading, onView, onApprove, onComplete, onCancel, onDelete,
}: Props) {
    const columns: ColumnsType<Export> = [
        {
            title: 'Mã phiếu',
            dataIndex: 'code',
            key: 'code',
            width: 140,
            render: (code: string) => <Tag color="cyan">{code}</Tag>,
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_: any, record: Export) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.customer?.name ?? '—'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.customer?.phone ?? record.customer?.email ?? ''}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Nhân viên',
            key: 'user',
            render: (_: any, record: Export) => (
                <Text>{record.user?.name ?? '—'}</Text>
            ),
        },
        {
            title: 'Số SP',
            key: 'num_details',
            width: 90,
            align: 'center',
            render: (_: any, record: Export) => (
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
                <Text strong style={{ color: '#0ea5e9' }}>{formatVnd(val)}</Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Chờ xử lý', value: 'pending' },
                { text: 'Đã duyệt', value: 'approved' },
                { text: 'Hoàn thành', value: 'completed' },
                { text: 'Đã hủy', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: ExportStatus) => {
                const cfg = STATUS_CONFIG[status] ?? { color: 'default', label: status };
                return <Tag color={cfg.color}>{cfg.label}</Tag>;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
            sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
            defaultSortOrder: 'descend',
            render: (val: string) => new Date(val).toLocaleString('vi-VN'),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 160,
            align: 'center',
            render: (_: any, record: Export) => {
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

                        {/* Duyệt đơn */}
                        {isPending && (
                            <Tooltip title="Duyệt đơn xuất">
                                <Popconfirm
                                    title="Duyệt đơn xuất kho?"
                                    description="Tồn kho sẽ bị trừ ngay khi duyệt. Hệ thống sẽ gửi email xác nhận đến khách hàng."
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
                            <Tooltip title="Xác nhận giao hàng thành công">
                                <Popconfirm
                                    title="Xác nhận đơn hàng đã giao?"
                                    description="Đơn sẽ chuyển sang trạng thái Hoàn thành."
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

                        {/* Hủy đơn */}
                        {!isDone && (
                            <Tooltip title="Hủy đơn xuất">
                                <Popconfirm
                                    title="Hủy đơn xuất kho?"
                                    onConfirm={() => onCancel(record.id)}
                                    okText="Hủy đơn"
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
                                    title="Xóa phiếu xuất?"
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
            dataSource={exports}
            loading={loading}
            rowKey="id"
            pagination={{ showTotal: (total) => `Tổng ${total} phiếu` }}
            scroll={{ x: 1200 }}
            rowClassName={(record) =>
                record.status === 'cancelled' ? 'ant-table-row-cancelled' : ''
            }
        />
    );
}
