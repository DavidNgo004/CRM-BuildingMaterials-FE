import { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Typography,
    Space,
    Alert,
    Statistic,
    Row,
    Col,
    Input,
} from 'antd';
import {
    PlusOutlined,
    ShoppingOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ProductTable from '../../components/admin/product/ProductTable';
import ProductModal from '../../components/admin/product/ProductModal';
import { useProduct } from '../../hooks/product/useProduct';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../types/product';
import '../../styles/auth.css';

const { Title, Text } = Typography;

export default function ProductPage() {
    useEffect(() => {
        document.title = 'Quản lý sản phẩm';
    }, []);
    const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } = useProduct();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const openCreate = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEdit = (product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (values: CreateProductRequest | UpdateProductRequest) => {
        setModalLoading(true);
        let success: boolean;
        if (editingProduct) {
            success = await updateProduct(editingProduct.id, values as UpdateProductRequest);
        } else {
            success = await createProduct(values as CreateProductRequest);
        }
        setModalLoading(false);
        if (success) {
            closeModal();
        }
    };

    const handleDelete = async (id: number) => {
        await deleteProduct(id);
    };

    // Tính toán thống kê
    const lowStockCount = products.filter(p => p.reorder_level !== null && p.stock <= p.reorder_level).length;

    // Filter products
    const filteredProducts = products.filter(p =>
        (p.name?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    return (
        <DashboardLayout userName={user?.name ?? 'Admin'} onLogout={handleLogout}>
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
                            style={{ width: 250 }}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreate}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #6366f1)',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                            }}
                        >
                            Thêm sản phẩm
                        </Button>
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
                    <ProductTable
                        products={filteredProducts}
                        loading={loading}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                </Card>

                {/* ── Modal ── */}
                <ProductModal
                    open={modalOpen}
                    editingProduct={editingProduct}
                    loading={modalLoading}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                />
            </div>
        </DashboardLayout>
    );
}
