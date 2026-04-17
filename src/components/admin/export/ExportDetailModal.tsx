import { Modal, Table, Tag, Typography, Descriptions, Divider, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Export, ExportDetail, ExportStatus } from '../../../types/Admin/export';

const { Text, Title } = Typography;

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
    open: boolean;
    record: Export | null;
    onClose: () => void;
}

export default function ExportDetailModal({ open, record, onClose }: Props) {
    if (!record) return null;

    const statusCfg = STATUS_CONFIG[record.status] ?? { color: 'default', label: record.status };

    const columns: ColumnsType<ExportDetail> = [
        {
            title: '#',
            key: 'index',
            width: 50,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_: any, row: ExportDetail) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{row.product?.name ?? `SP #${row.product_id}`}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        ĐVT: {row.product?.unit ?? '—'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 90,
            align: 'right',
            render: (val: number) => <Text strong>{Number(val).toLocaleString('vi-VN')}</Text>,
        },
        {
            title: 'Đơn giá bán',
            dataIndex: 'unit_price',
            key: 'unit_price',
            align: 'right',
            render: (val: number) => formatVnd(val),
        },
        {
            title: 'Giá vốn',
            dataIndex: 'import_price',
            key: 'import_price',
            align: 'right',
            render: (val: number) => (
                <Text type="secondary">{formatVnd(val)}</Text>
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total_price',
            key: 'total_price',
            align: 'right',
            render: (val: number) => (
                <Text strong style={{ color: '#0ea5e9' }}>{formatVnd(val)}</Text>
            ),
        },
    ];

    return (
        <Modal
            title={
                <Space>
                    <Title level={5} style={{ margin: 0 }}>Chi tiết phiếu xuất kho</Title>
                    <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
                </Space>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={860}
        >
            {/* Thông tin chung */}
            <Descriptions size="small" column={2} style={{ marginBottom: 16 }} bordered>
                <Descriptions.Item label="Mã phiếu">
                    <Tag color="cyan">{record.code}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                    {new Date(record.created_at).toLocaleString('vi-VN')}
                </Descriptions.Item>
                <Descriptions.Item label="Nhân viên lập">
                    {record.user?.name ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Email NV">
                    {record.user?.email ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                    <Text strong>{record.customer?.name ?? '—'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="SĐT / Email KH">
                    {record.customer?.phone ?? record.customer?.email ?? '—'}
                </Descriptions.Item>
                {record.customer?.address && (
                    <Descriptions.Item label="Địa chỉ" span={2}>
                        {record.customer.address}
                    </Descriptions.Item>
                )}
                {record.note && (
                    <Descriptions.Item label="Ghi chú" span={2}>
                        {record.note}
                    </Descriptions.Item>
                )}
            </Descriptions>

            {/* Bảng chi tiết sản phẩm */}
            <Table
                columns={columns}
                dataSource={record.details ?? []}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 680 }}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={5} align="right">
                                <Text type="secondary">Tổng tiền hàng:</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">
                                <Text>{formatVnd(record.total_price)}</Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                        {Number(record.discount_amount) > 0 && (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={5} align="right">
                                    <Text type="secondary">Chiết khấu:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">
                                    <Text type="success">-{formatVnd(record.discount_amount)}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={5} align="right">
                                <Text strong>Tổng thanh toán:</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">
                                <Text strong style={{ color: '#0ea5e9', fontSize: 16 }}>
                                    {formatVnd(record.grand_total)}
                                </Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />

            {/* Tóm tắt tài chính */}
            <Divider style={{ margin: '16px 0 8px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 32 }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Doanh thu</div>
                    <div style={{ fontWeight: 700, color: '#0ea5e9', fontSize: 15 }}>
                        {formatVnd(record.grand_total)}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Giá vốn</div>
                    <div style={{ fontWeight: 700, color: '#ef4444', fontSize: 15 }}>
                        {formatVnd(
                            (record.details ?? []).reduce(
                                (s, d) => s + (Number(d.import_price) || 0) * (Number(d.quantity) || 0),
                                0
                            )
                        )}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Lợi nhuận</div>
                    <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 15 }}>
                        {formatVnd(
                            Number(record.grand_total) -
                            (record.details ?? []).reduce(
                                (s, d) => s + (Number(d.import_price) || 0) * (Number(d.quantity) || 0),
                                0
                            )
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
