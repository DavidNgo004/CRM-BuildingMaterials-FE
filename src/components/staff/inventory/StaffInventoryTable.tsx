import { Table, Tag } from 'antd';
import type { InventoryLog } from '../../../api/inventory/inventoryLogApi';

interface StaffInventoryTableProps {
    logs: InventoryLog[];
    loading: boolean;
}

export default function StaffInventoryTable({ logs, loading }: StaffInventoryTableProps) {
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: ['product', 'name'],
            key: 'product_name',
            render: (text: string, record: InventoryLog) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>ĐVT: {record.product?.unit}</div>
                </div>
            ),
        },
        {
            title: 'Loại biến động',
            dataIndex: 'type',
            key: 'type',
            render: (type: 'import' | 'export') => (
                <Tag color={type === 'import' ? 'green' : 'orange'} style={{ borderRadius: 6 }}>
                    {type === 'import' ? 'NHẬP KHO' : 'XUẤT KHO'}
                </Tag>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity: number, record: InventoryLog) => (
                <span style={{ 
                    fontWeight: 700, 
                    color: record.type === 'import' ? '#10b981' : '#f59e0b',
                    fontSize: '15px'
                }}>
                    {record.type === 'import' ? '+' : '-'}{quantity}
                </span>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => (
                <span style={{ color: '#595959' }}>
                    {new Date(date).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                </span>
            ),
        },
        {
            title: 'Mã tham chiếu',
            dataIndex: 'reference_id',
            key: 'reference_id',
            render: (id: number, record: InventoryLog) => (
                <Tag style={{ borderRadius: 4 }}>
                    #{record.type === 'import' ? 'NK' : 'XK'}{id}
                </Tag>
            ),
        },
    ];

    return (
        <Table 
            columns={columns} 
            dataSource={logs} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 15 }}
            scroll={{ x: 600 }}
            style={{ borderRadius: 12, overflow: 'hidden' }}
        />
    );
}
