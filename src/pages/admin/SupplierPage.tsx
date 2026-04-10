import { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Typography,
    Space,
    Alert,
    Statistic,
} from 'antd';
import {
    PlusOutlined,
    ShopOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import SupplierTable from '../../components/supplier/supplierTable';
import SupplierModal from '../../components/supplier/SupplierModal';
import { useSupplier } from '../../hooks/supplier/useSupplier';
import type { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../../types/supplier';
import '../../styles/auth.css';

const { Title, Text } = Typography;

export default function SupplierPage() {
    const { suppliers, loading, error, fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } = useSupplier();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const openCreate = () => {
        setEditingSupplier(null);
        setModalOpen(true);
    };

    const openEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingSupplier(null);
    };

    const handleSubmit = async (values: CreateSupplierRequest | UpdateSupplierRequest) => {
        setModalLoading(true);

        let success: boolean;
        if (editingSupplier) {
            success = await updateSupplier(editingSupplier.id, values as UpdateSupplierRequest);
        } else {
            success = await createSupplier(values as CreateSupplierRequest);
        }

        setModalLoading(false);

        if (success) {
            closeModal();
        }
    };

    const handleDelete = async (id: number) => {
        await deleteSupplier(id);
    };

    return (
        <DashboardLayout userName={user?.name ?? 'Admin'} onLogout={handleLogout}>
            <div className="auth-inner-page">
                {/* ── Header ── */}
                <div className="auth-page-header">
                    <Space direction="vertical" size={2}>
                        <Title level={4} style={{ margin: 0 }}>
                            <ShopOutlined style={{ color: '#6366f1', marginRight: 10 }} />
                            Quản lý nhà cung cấp
                        </Title>
                        <Text type="secondary">Quản lý đối tác và nhà cung cấp vật liệu</Text>
                    </Space>

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
                        Thêm nhà cung cấp
                    </Button>
                </div>

                {/* ── Stats ── */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    <Card style={{ borderRadius: 12, flex: '0 0 auto' }} styles={{ body: { padding: '16px 24px' } }}>
                        <Statistic
                            title="Tổng nhà cung cấp"
                            value={suppliers.length}
                            prefix={<ShopOutlined style={{ color: '#6366f1' }} />}
                            valueStyle={{ fontSize: 28, fontWeight: 700, color: '#6366f1' }}
                        />
                    </Card>
                </div>

                {/* ── Error Banner ── */}
                {error && (
                    <Alert message={error} type="error" showIcon closable style={{ marginBottom: 16, borderRadius: 10 }} />
                )}

                {/* ── Table ── */}
                <Card style={{ borderRadius: 16 }}>
                    <SupplierTable
                        suppliers={suppliers}
                        loading={loading}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                </Card>

                {/* ── Modal ── */}
                <SupplierModal
                    open={modalOpen}
                    editingSupplier={editingSupplier}
                    loading={modalLoading}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                />
            </div>
        </DashboardLayout>
    );
}