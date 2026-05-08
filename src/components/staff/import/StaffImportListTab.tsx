import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Select, Popconfirm, Input, Typography, Modal } from 'antd';
import {
    CheckCircleOutlined, CloseCircleOutlined, EyeOutlined,
    ClockCircleOutlined, CheckOutlined,
} from '@ant-design/icons';
import { useStaffImportList } from '../../../hooks/import/useStaffImportList';
import type { Import } from '../../../types/Admin/import';

const { Text } = Typography;
const { Option } = Select;

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ duyệt', color: 'orange' },
    approved: { label: 'Đã duyệt - Chờ hàng về', color: 'blue' },
    completed: { label: 'Hoàn thành', color: 'green' },
    cancelled: { label: 'Đã hủy', color: 'default' },
};

export default function StaffImportListTab() {
    const { imports, loading, fetchImports, confirmDelivered, cancelImport } = useStaffImportList();
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [detailRecord, setDetailRecord] = useState<Import | null>(null);

    // Cancel Modal State
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelingId, setCancelingId] = useState<number | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    const handleCancelClick = (id: number) => {
        setCancelingId(id);
        setCancelReason('');
        setCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        if (!cancelingId) return;
        if (!cancelReason.trim()) {
            import('antd').then(({ message }) => message.error('Vui lòng nhập lý do huỷ đơn hàng'));
            return;
        }
        await cancelImport(cancelingId, cancelReason);
        setCancelModalOpen(false);
        setCancelingId(null);
    };

    useEffect(() => {
        fetchImports();
    }, [fetchImports]);

    const filtered = imports.filter(imp => {
        const matchStatus = statusFilter === 'all' || imp.status === statusFilter;
        const matchSearch = !searchText ||
            (imp.code || '').toLowerCase().includes(searchText.toLowerCase());
        return matchStatus && matchSearch;
    });

    const formatVnd = (v: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

    const columns = [
        {
            title: 'Mã phiếu',
            dataIndex: 'code',
            key: 'code',
            render: (code: string) => <Text strong style={{ color: '#6366f1' }}>{code}</Text>,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (d: string) => new Date(d).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'grand_total',
            key: 'grand_total',
            render: (v: number) => <Text strong>{formatVnd(v)}</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => (
                <Tag color={STATUS_LABEL[s]?.color}>{STATUS_LABEL[s]?.label ?? s}</Tag>
            ),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            ellipsis: true,
            render: (n: string) => n || <Text type="secondary">—</Text>,
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: any, record: Import) => (
                <Space size="small" wrap>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => setDetailRecord(record)}
                    >
                        Chi tiết
                    </Button>
                    {record.status === 'approved' && (
                        <Popconfirm
                            title="Xác nhận hàng đã về kho?"
                            description="Thao tác này sẽ cập nhật tồn kho và không thể hoàn tác."
                            onConfirm={() => confirmDelivered(record.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ style: { background: '#10b981' } }}
                        >
                            <Button size="small" icon={<CheckCircleOutlined />} style={{ color: '#10b981', borderColor: '#10b981' }}>
                                Hàng đã về
                            </Button>
                        </Popconfirm>
                    )}
                    {(record.status === 'approved') && (
                        <Button size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleCancelClick(record.id)}>
                            Hủy đơn
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
            <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Input.Search
                    placeholder="Tìm theo mã phiếu..."
                    allowClear
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 220 }}
                />
                <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 200 }}>
                    <Option value="all">Tất cả</Option>
                    <Option value="pending"><ClockCircleOutlined style={{ color: '#f59e0b' }} /> Chờ duyệt</Option>
                    <Option value="approved"><CheckOutlined style={{ color: '#3b82f6' }} /> Đã duyệt - Chờ hàng</Option>
                    <Option value="completed"><CheckCircleOutlined style={{ color: '#10b981' }} /> Hoàn thành</Option>
                    <Option value="cancelled"><CloseCircleOutlined /> Đã hủy</Option>
                </Select>
            </Space>

            <Table
                columns={columns}
                dataSource={filtered}
                rowKey="id"
                loading={loading}
                scroll={{ x: 700 }}
                pagination={{ pageSize: 10, showSizeChanger: false }}
                size="small"
            />

            {/* Detail Modal */}
            <Modal
                title={`Chi tiết phiếu nhập — ${detailRecord?.code}`}
                open={!!detailRecord}
                onCancel={() => setDetailRecord(null)}
                footer={null}
                width={700}
            >
                {detailRecord && (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Trạng thái: </Text>
                            <Tag color={STATUS_LABEL[detailRecord.status]?.color}>
                                {STATUS_LABEL[detailRecord.status]?.label}
                            </Tag>
                        </div>
                        <Table
                            size="small"
                            pagination={false}
                            dataSource={detailRecord.details || []}
                            rowKey="id"
                            columns={[
                                { title: 'Sản phẩm', dataIndex: ['product', 'name'], key: 'name' },
                                { title: 'ĐVT', dataIndex: ['product', 'unit'], key: 'unit' },
                                { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
                                { title: 'Đơn giá', dataIndex: 'unit_price', key: 'unit_price', render: (v: number) => formatVnd(v) },
                                { title: 'Thành tiền', dataIndex: 'total_price', key: 'total_price', render: (v: number) => formatVnd(v) },
                            ]}
                        />
                        <div style={{ textAlign: 'right', marginTop: 16 }}>
                            <Text strong style={{ fontSize: 16 }}>Tổng thanh toán: </Text>
                            <Text strong style={{ fontSize: 18, color: '#6366f1' }}>
                                {formatVnd(detailRecord.grand_total)}
                            </Text>
                        </div>
                        {detailRecord.note && (
                            <div style={{ marginTop: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
                                <Text type="secondary">Ghi chú: {detailRecord.note}</Text>
                            </div>
                        )}
                    </>
                )}
            </Modal>

            {/* Cancel Modal */}
            <Modal
                title="Xác nhận huỷ đơn nhập hàng"
                open={cancelModalOpen}
                onOk={confirmCancel}
                onCancel={() => setCancelModalOpen(false)}
                okText="Xác nhận huỷ"
                cancelText="Đóng"
                okButtonProps={{ danger: true }}
            >
                <Typography.Text strong>Lý do huỷ đơn:</Typography.Text>
                <Input.TextArea
                    rows={4}
                    placeholder="Nhập lý do huỷ..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    style={{ marginTop: 8 }}
                />
            </Modal>
        </>
    );
}
