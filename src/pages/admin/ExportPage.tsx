import { useState, useEffect } from 'react';
import {
    Card, Typography, Space, Alert, Row, Col,
    Statistic, Input, Tag, Tabs,
} from 'antd';
import {
    ShoppingCartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ExportTable from '../../components/admin/export/ExportTable';
import ExportDetailModal from '../../components/admin/export/ExportDetailModal';
import { useExport } from '../../hooks/export/useExport';
import type { Export, ExportStatus } from '../../types/Admin/export';
import '../../styles/auth.css';

const { Title, Text } = Typography;

export default function ExportPage() {
    useEffect(() => {
        document.title = 'Quản lý xuất kho';
    }, [])
    const { exports, loading, error, fetchExports, changeStatus, deleteExport } = useExport();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedExport, setSelectedExport] = useState<Export | null>(null);

    useEffect(() => {
        fetchExports({ per_page: 9999 });
    }, [fetchExports]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // ── Filter logic ──────────────────────────────────────────────────────────
    const filteredByTab = activeTab === 'all'
        ? exports
        : exports.filter(i => i.status === activeTab);

    const filteredExports = filteredByTab.filter(i =>
        (i.code || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (i.customer?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (i.customer?.phone || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (i.user?.name || '').toLowerCase().includes(searchText.toLowerCase())
    );

    // ── Stats ─────────────────────────────────────────────────────────────────
    const countByStatus = (status: ExportStatus) =>
        exports.filter(i => i.status === status).length;

    const totalRevenue = exports
        .filter(i => i.status === 'completed')
        .reduce((sum, i) => sum + (Number(i.grand_total) || 0), 0);

    // ── Actions ───────────────────────────────────────────────────────────────
    const handleView = (record: Export) => {
        setSelectedExport(record);
        setDetailOpen(true);
    };

    const handleApprove = (id: number) => changeStatus(id, 'approved');
    const handleComplete = (id: number) => changeStatus(id, 'completed');
    const handleCancel = (id: number) => changeStatus(id, 'cancelled');
    const handleDelete = (id: number) => deleteExport(id);

    const tabItems = [
        { key: 'all', label: <><FileTextOutlined />  Tất cả <Tag>{exports.length}</Tag></> },
        { key: 'pending', label: <><ClockCircleOutlined style={{ color: '#f59e0b' }} /> Chờ xử lý <Tag color="orange">{countByStatus('pending')}</Tag></> },
        { key: 'approved', label: <><CheckCircleOutlined style={{ color: '#3b82f6' }} /> Đã duyệt <Tag color="blue">{countByStatus('approved')}</Tag></> },
        { key: 'completed', label: <><CheckCircleOutlined style={{ color: '#16a34a' }} /> Hoàn thành <Tag color="success">{countByStatus('completed')}</Tag></> },
        { key: 'cancelled', label: <><CloseCircleOutlined style={{ color: '#9ca3af' }} /> Đã hủy <Tag>{countByStatus('cancelled')}</Tag></> },
    ];

    return (
        <DashboardLayout userName={user?.name ?? 'Admin'} onLogout={handleLogout}>
            <div className="auth-inner-page">

                {/* ── Page Header ── */}
                <div className="auth-page-header">
                    <Space direction="vertical" size={2}>
                        <Title level={4} style={{ margin: 0 }}>
                            <ShoppingCartOutlined style={{ color: '#0ea5e9', marginRight: 10 }} />
                            Quản lý xuất kho
                        </Title>
                        <Text type="secondary">Theo dõi, duyệt và quản lý toàn bộ đơn bán hàng xuất kho</Text>
                    </Space>
                    <Input.Search
                        placeholder="Tìm mã phiếu, khách hàng, nhân viên..."
                        allowClear
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 280 }}
                    />
                </div>

                {/* ── KPI Cards ── */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }}>
                            <Statistic
                                title="Tổng đơn xuất"
                                value={exports.length}
                                prefix={<FileTextOutlined style={{ color: '#0ea5e9' }} />}
                                valueStyle={{ color: '#0ea5e9', fontWeight: 700 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }}>
                            <Statistic
                                title="Chờ xử lý"
                                value={countByStatus('pending')}
                                prefix={<ClockCircleOutlined style={{ color: '#f59e0b' }} />}
                                valueStyle={{ color: '#f59e0b', fontWeight: 700 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }}>
                            <Statistic
                                title="Hoàn thành"
                                value={countByStatus('completed')}
                                prefix={<CheckCircleOutlined style={{ color: '#16a34a' }} />}
                                valueStyle={{ color: '#16a34a', fontWeight: 700 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }}>
                            <Statistic
                                title="Doanh thu (Hoàn thành)"
                                value={totalRevenue}
                                formatter={v =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v))
                                }
                                prefix={<DollarOutlined style={{ color: '#0ea5e9' }} />}
                                valueStyle={{ color: '#0ea5e9', fontWeight: 700, fontSize: 18 }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* ── Error ── */}
                {error && (
                    <Alert message={error} type="error" showIcon closable style={{ marginBottom: 16, borderRadius: 10 }} />
                )}

                {/* ── Main Table Card ── */}
                <Card
                    style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    styles={{ body: { padding: 0 } }}
                >
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        style={{ padding: '0 16px' }}
                        tabBarStyle={{ marginBottom: 0 }}
                    />
                    <div style={{ padding: '16px 16px 0' }}>
                        <ExportTable
                            exports={filteredExports}
                            loading={loading}
                            onView={handleView}
                            onApprove={handleApprove}
                            onComplete={handleComplete}
                            onCancel={handleCancel}
                            onDelete={handleDelete}
                        />
                    </div>
                </Card>

                {/* ── Modal Chi tiết ── */}
                <ExportDetailModal
                    open={detailOpen}
                    record={selectedExport}
                    onClose={() => setDetailOpen(false)}
                />
            </div>
        </DashboardLayout>
    );
}
