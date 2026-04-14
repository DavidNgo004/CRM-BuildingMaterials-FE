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
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import CustomerTable from '../../components/customer/CustomerTable';
import CustomerModal from '../../components/customer/CustomerModal';
import { useCustomer } from '../../hooks/customer/useCustomer';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../types/Admin/customer';
import '../../styles/auth.css';

const { Title, Text } = Typography;

export default function CustomerPage() {
    useEffect(() => {
        document.title = 'Quản lý khách hàng';
    }, []);
    const { customers, loading, error, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomer();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const openCreate = () => {
        setEditingCustomer(null);
        setModalOpen(true);
    };

    const openEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCustomer(null);
    };

    const handleSubmit = async (values: CreateCustomerRequest | UpdateCustomerRequest) => {
        setModalLoading(true);
        let success: boolean;
        if (editingCustomer) {
            success = await updateCustomer(editingCustomer.id, values as UpdateCustomerRequest);
        } else {
            success = await createCustomer(values as CreateCustomerRequest);
        }
        setModalLoading(false);
        if (success) {
            closeModal();
        }
    };

    const handleDelete = async (id: number) => {
        await deleteCustomer(id);
    };

    // Filter customers locally by name or phone
    const filteredCustomers = Array.isArray(customers) ? customers.filter(c =>
        (c.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (c.phone || '').includes(searchText) ||
        (c.code || '').toLowerCase().includes(searchText.toLowerCase())
    ) : [];

    // Stats
    const wholesaleCount = Array.isArray(customers) ? customers.filter(c => c.customer_type === 'wholesale').length : 0;
    const retailCount = Array.isArray(customers) ? customers.filter(c => c.customer_type === 'retail').length : 0;

    return (
        <DashboardLayout userName={user?.name ?? 'Admin'} onLogout={handleLogout}>
            <div className="auth-inner-page">
                {/* ── Header ── */}
                <div className="auth-page-header">
                    <Space direction="vertical" size={2}>
                        <Title level={4} style={{ margin: 0 }}>
                            <TeamOutlined style={{ color: '#6366f1', marginRight: 10 }} />
                            Quản lý khách hàng
                        </Title>
                        <Text type="secondary">Quản lý hồ sơ và thông tin đối tác mua hàng</Text>
                    </Space>

                    <Space size="middle">
                        <Input.Search
                            placeholder="Tìm tên, SĐT, mã KH..."
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
                            Thêm khách hàng
                        </Button>
                    </Space>
                </div>

                {/* ── Stats ── */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic
                                title="Tổng khách hàng"
                                value={customers.length}
                                prefix={<UserOutlined style={{ color: '#6366f1' }} />}
                                valueStyle={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}
                            />
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic
                                title="Khách bán sỉ"
                                value={wholesaleCount}
                                valueStyle={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}
                            />
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic
                                title="Khách bán lẻ"
                                value={retailCount}
                                valueStyle={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}
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
                    <CustomerTable
                        customers={filteredCustomers}
                        loading={loading}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                </Card>

                {/* ── Modal ── */}
                <CustomerModal
                    open={modalOpen}
                    editingCustomer={editingCustomer}
                    loading={modalLoading}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                />
            </div>
        </DashboardLayout>
    );
}
