import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Select, Popconfirm, Input, Typography, Modal } from 'antd';
import {
    CheckCircleOutlined, CloseCircleOutlined, EyeOutlined,
    ClockCircleOutlined, CheckOutlined,
} from '@ant-design/icons';
import { useStaffExportList } from '../../../hooks/export/useStaffExportList';
import type { Export } from '../../../types/Admin/export';

const { Text } = Typography;
const { Option } = Select;

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ xử lý', color: 'orange' },
    approved: { label: 'Đã duyệt - Chờ xuất', color: 'blue' },
    completed: { label: 'Hoàn thành', color: 'green' },
    cancelled: { label: 'Đã hủy', color: 'default' },
};

export default function StaffExportListTab() {
    const { exports, loading, fetchExports, confirmExported, cancelExport } = useStaffExportList();
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [detailRecord, setDetailRecord] = useState<Export | null>(null);

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
        await cancelExport(cancelingId, cancelReason);
        setCancelModalOpen(false);
        setCancelingId(null);
    };

    const handlePrint = () => {
        if (!detailRecord) return;
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) return;
        
        const html = `
        <html>
        <head>
            <title>Phiếu Xuất Kho - ${detailRecord.code}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.5; }
                h1 { text-align: center; color: #333; }
                .info { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .text-right { text-align: right; }
                .total { margin-top: 20px; text-align: right; font-size: 1.2em; font-weight: bold; }
                .footer { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; }
                .signature { width: 200px; }
            </style>
        </head>
        <body>
            <h1>PHIẾU XUẤT KHO</h1>
            <div class="info">
                <p><strong>Mã phiếu:</strong> ${detailRecord.code}</p>
                <p><strong>Ngày lập:</strong> ${new Date(detailRecord.created_at).toLocaleString('vi-VN')}</p>
                <p><strong>Khách hàng:</strong> ${detailRecord.customer?.name || '---'}</p>
                <p><strong>Địa chỉ:</strong> ${detailRecord.customer?.address || '---'}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>ĐVT</th>
                        <th class="text-right">Số lượng</th>
                        <th class="text-right">Đơn giá</th>
                        <th class="text-right">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${(detailRecord.details || []).map((d, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${d.product?.name || ''}</td>
                            <td>${d.product?.unit || ''}</td>
                            <td class="text-right">${d.quantity}</td>
                            <td class="text-right">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.unit_price)}</td>
                            <td class="text-right">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.total_price)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="total">
                Tổng thanh toán: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(detailRecord.grand_total))}
            </div>
            <div class="footer">
                <div class="signature">
                    <strong>Người lập phiếu</strong><br/><br/><br/><br/>
                    ${detailRecord.user?.name || ''}
                </div>
                <div class="signature">
                    <strong>Người nhận hàng</strong><br/><br/><br/><br/>
                    (Ký, ghi rõ họ tên)
                </div>
            </div>
        </body>
        </html>`;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    useEffect(() => {
        fetchExports();
    }, [fetchExports]);

    const filtered = exports.filter(exp => {
        const matchStatus = statusFilter === 'all' || exp.status === statusFilter;
        const matchSearch = !searchText ||
            (exp.code || '').toLowerCase().includes(searchText.toLowerCase());
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
            render: (_: any, record: Export) => (
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
                            title="Xác nhận đã xuất kho?"
                            description="Thao tác này sẽ cập nhật tồn kho và không thể hoàn tác."
                            onConfirm={() => confirmExported(record.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ style: { background: '#10b981' } }}
                        >
                            <Button size="small" icon={<CheckCircleOutlined />} style={{ color: '#10b981', borderColor: '#10b981' }}>
                                Xác nhận xuất kho
                            </Button>
                        </Popconfirm>
                    )}
                    {record.status === 'pending' && (
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
                    <Option value="pending"><ClockCircleOutlined style={{ color: '#f59e0b' }} /> Chờ xử lý</Option>
                    <Option value="approved"><CheckOutlined style={{ color: '#3b82f6' }} /> Đã duyệt - Chờ xuất</Option>
                    <Option value="completed"><CheckCircleOutlined style={{ color: '#10b981' }} /> Hoàn thành</Option>
                    <Option value="cancelled"><CloseCircleOutlined /> Đã hủy</Option>
                </Select>
            </Space>

            <Table
                columns={columns}
                dataSource={filtered}
                rowKey="id"
                loading={loading}
                scroll={{ x: 'max-content' }}
                pagination={{ pageSize: 10, showSizeChanger: false }}
                size="small"
            />

            {/* Detail Modal */}
            <Modal
                title={`Chi tiết phiếu xuất — ${detailRecord?.code}`}
                open={!!detailRecord}
                onCancel={() => setDetailRecord(null)}
                footer={
                    <Space>
                        <Button onClick={() => setDetailRecord(null)}>Đóng</Button>
                        <Button type="primary" onClick={handlePrint}>In Hoá Đơn</Button>
                    </Space>
                }
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
                title="Xác nhận huỷ đơn xuất kho"
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
