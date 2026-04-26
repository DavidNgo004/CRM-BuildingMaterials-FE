import { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Space,
    Alert,
    Statistic,
    Row,
    Col,
    Input,
    Select,
} from 'antd';
import {
    ShoppingOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import StaffLayout from '../../components/staff/StaffLayout';
import StaffProductTable from '../../components/staff/product/StaffProductTable';
import StaffProductFormModal from '../../components/staff/product/StaffProductFormModal';
import { useProduct } from '../../hooks/product/useProduct';
import type { Product, UpdateProductRequest } from '../../types/product';
import '../../styles/auth.css';

const { Title, Text } = Typography;

export default function StaffProductPage() {
    useEffect(() => {
        document.title = 'Quản lý sản phẩm - Nhân viên kho';
    }, []);
    const { products, loading, error, fetchProducts, updateProduct } = useProduct();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'normal'>('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const openEdit = (product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (values: UpdateProductRequest) => {
        if (!editingProduct) return;
        setModalLoading(true);
        const success = await updateProduct(editingProduct.id, values);
        setModalLoading(false);
        if (success) {
            closeModal();
        }
    };

    // Tính toán thống kê
    const lowStockCount = products.filter(p => p.reorder_level !== null && p.stock <= p.reorder_level).length;

    // Filter products
    const filteredProducts = products.filter(p => {
        const matchSearch = (p.name?.toLowerCase() || '').includes(searchText.toLowerCase());
        const isLow = p.reorder_level !== null && p.stock <= p.reorder_level;
        const matchStock =
            stockFilter === 'all' ? true :
            stockFilter === 'low' ? isLow :
            !isLow;
        return matchSearch && matchStock;
    });

    return (
        <StaffLayout onLogout={handleLogout}>
            <div className="auth-inner-page">
                {/* ── Header ── */}
                <div className="auth-page-header">
                    <Space direction="vertical" size={2}>
                        <Title level={4} style={{ margin: 0 }}>
                            <ShoppingOutlined style={{ color: '#6366f1', marginRight: 10 }} />
                            Quản lý sản phẩm
                        </Title>
                        <Text type="secondary">Danh mục vật liệu xây dựng và hàng hóa</Text>
                    </Space>

                    <Space size="middle">
                        <Input.Search
                            placeholder="Tìm kiếm sản phẩm..."
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 240 }}
                        />
                        <Select
                            value={stockFilter}
                            onChange={v => setStockFilter(v)}
                            style={{ width: 160 }}
                        >
                            <Select.Option value="all">Tất cả</Select.Option>
                            <Select.Option value="low">Sắp hết hàng</Select.Option>
                            <Select.Option value="normal">Còn hàng</Select.Option>
                        </Select>
                    </Space>
                </div>

                {/* ── Stats ── */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic
                                title="Tổng sản phẩm"
                                value={products.length}
                                prefix={<ShoppingOutlined style={{ color: '#6366f1' }} />}
                                valueStyle={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}
                            />
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic
                                title="Sắp hết hàng"
                                value={lowStockCount}
                                prefix={<WarningOutlined style={{ color: '#f59e0b' }} />}
                                valueStyle={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* ── Error Banner ── */}
                {error && (
                    <Alert message={error} type="error" showIcon closable style={{ marginBottom: 16, borderRadius: 10 }} />
                )}

                {/* ── Table ── */}
                <Card style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <StaffProductTable
                        products={filteredProducts}
                        loading={loading}
                        onEdit={openEdit}
                    />
                </Card>

                {/* ── Modal ── */}
                <StaffProductFormModal
                    open={modalOpen}
                    editingProduct={editingProduct}
                    loading={modalLoading}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                />
            </div>
        </StaffLayout>
    );
}
