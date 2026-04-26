import { Table, Tag, Space, Button, Tooltip, Avatar } from 'antd';
import { EditOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import type { Product } from '../../../types/product';

interface StaffProductTableProps {
    products: Product[];
    loading: boolean;
    onEdit: (product: Product) => void;
}

export default function StaffProductTable({ products, loading, onEdit }: StaffProductTableProps) {
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Product) => (
                <Space>
                    <div style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 8, 
                        background: '#f0f2f5', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#6366f1'
                    }}>
                        <ShoppingOutlined />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>{text}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.unit}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: ['supplier', 'name'],
            key: 'supplier',
            render: (text: string) => text || 'N/A',
        },
        {
            title: 'Giá nhập',
            dataIndex: 'import_price',
            key: 'import_price',
            render: (price: number) => (
                <span style={{ fontWeight: 500 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </span>
            ),
        },
        {
            title: 'Giá bán',
            dataIndex: 'sell_price',
            key: 'sell_price',
            render: (price: number) => (
                <span style={{ fontWeight: 600, color: '#10b981' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </span>
            ),
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: number, record: Product) => {
                const isLow = record.reorder_level !== null && stock <= record.reorder_level;
                return (
                    <Tag color={isLow ? 'volcano' : 'blue'} style={{ borderRadius: 6, fontWeight: 600 }}>
                        {stock} {record.unit}
                    </Tag>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean | number) => (
                <Tag color={status ? 'green' : 'red'} style={{ borderRadius: 6 }}>
                    {status ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                </Tag>
            ),
        },
        {
            title: 'Người chỉnh sửa',
            key: 'updated_by',
            render: (_: any, record: Product) => {
                const updater = record.updated_by as any;
                if (updater && typeof updater === 'object' && updater.name) {
                    return (
                        <Space>
                            <Avatar size="small" style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                            <span style={{ fontSize: '13px', color: '#595959' }}>{updater.name}</span>
                        </Space>
                    );
                }
                return <span style={{ color: '#bfbfbf', fontSize: '13px' }}>Chưa có</span>;
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            render: (_: any, record: Product) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="text" 
                            icon={<EditOutlined style={{ color: '#6366f1' }} />} 
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>
                    {/* Không có nút Xóa */}
                </Space>
            ),
        },
    ];

    return (
        <Table 
            columns={columns} 
            dataSource={products} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
            style={{ borderRadius: 8, overflow: 'hidden' }}
        />
    );
}
