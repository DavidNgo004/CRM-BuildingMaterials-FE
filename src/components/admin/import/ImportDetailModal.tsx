import { Modal, Table, Tag, Typography, Descriptions, Divider, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Import, ImportDetail, ImportStatus } from '../../../types/Admin/import';

const { Text, Title } = Typography;

const STATUS_CONFIG: Record<ImportStatus, { color: string; label: string }> = {
    pending: { color: 'orange', label: 'Chờ duyệt' },
    approved: { color: 'blue', label: 'Đã duyệt' },
    completed: { color: 'success', label: 'Hoàn thành' },
    cancelled: { color: 'default', label: 'Đã hủy' },
};

const formatVnd = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

interface Props {
    open: boolean;
    record: Import | null;
    onClose: () => void;
}

export default function ImportDetailModal({ open, record, onClose }: Props) {
    if (!record) return null;

    const statusCfg = STATUS_CONFIG[record.status];

    const columns: ColumnsType<ImportDetail> = [
        {
            title: '#',
            key: 'index',
            width: 50,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_: any, row: ImportDetail) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{row.product?.name ?? `SP #${row.product_id}`}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Nhà CC: {row.product?.supplier?.name ?? '—'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'ĐVT',
            key: 'unit',
            width: 70,
            render: (_: any, row: ImportDetail) => row.product?.unit ?? '—',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 90,
            align: 'right',
            render: (val: number) => <Text strong>{val.toLocaleString('vi-VN')}</Text>,
        },
        {
            title: 'Đơn giá nhập',
            dataIndex: 'unit_price',
            key: 'unit_price',
            align: 'right',
            render: (val: number) => formatVnd(val),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total_price',
            key: 'total_price',
            align: 'right',
            render: (val: number) => (
                <Text strong style={{ color: '#6366f1' }}>{formatVnd(val)}</Text>
            ),
        },
    ];

    return (
        <Modal
            title={
                <Space>
                    <Title level={5} style={{ margin: 0 }}>Chi tiết phiếu nhập</Title>
                    <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
                </Space>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={780}
        >
            <Descriptions
                size="small"
                column={2}
                style={{ marginBottom: 16 }}
                bordered
            >
                <Descriptions.Item label="Mã phiếu">
                    <Tag color="geekblue">{record.code}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                    {new Date(record.created_at).toLocaleString('vi-VN')}
                </Descriptions.Item>
                <Descriptions.Item label="Người lập">
                    {record.user?.name ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {record.user?.email ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú" span={2}>
                    {record.note || '—'}
                </Descriptions.Item>
            </Descriptions>

            <Table
                columns={columns}
                dataSource={record.details ?? []}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 600 }}
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
                        {record.discount_amount > 0 && (
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
                                <Text strong style={{ color: '#6366f1', fontSize: 16 }}>
                                    {formatVnd(record.grand_total)}
                                </Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
        </Modal>
    );
}
