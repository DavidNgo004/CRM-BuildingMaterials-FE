import { Table, Tag, Space, Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { Product } from '../../types/product';

interface ProductTableProps {
    products: Product[];
    loading: boolean;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

export default function ProductTable({ products, loading, onEdit, onDelete }: ProductTableProps) {
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
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_: any, record: Product) => (
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
                            title="Xóa sản phẩm"
                            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
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
            dataSource={products} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
            style={{ borderRadius: 8, overflow: 'hidden' }}
        />
    );
}
