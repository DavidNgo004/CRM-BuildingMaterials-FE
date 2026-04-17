import { useState, useEffect } from 'react';
import {
    Card, Button, Typography, Space, Alert, Row, Col,
    Statistic, Input, Tag, Tabs, message,
} from 'antd';
import {
    PlusOutlined,
    InboxOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    FileExcelOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ImportTable from '../../components/admin/import/ImportTable';
import ImportDetailModal from '../../components/admin/import/ImportDetailModal';
import ImportFormModal from '../../components/admin/import/ImportFormModal';
import ImportExcelModal from '../../components/admin/import/ImportExcelModal';
import { useImport } from '../../hooks/import/useImport';
import { importApi } from '../../api/import/importApi';
import type { Import, ImportStatus, StoreImportRequest } from '../../types/Admin/import';
import '../../styles/auth.css';

const { Title, Text } = Typography;

export default function ImportPage() {
    useEffect(() => {
        document.title = 'Quản lý nhập kho';
    })
    const { imports, loading, error, fetchImports, createImport, updateImport, changeStatus, deleteImport, importExcel } = useImport();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState<string>('all');

    // Modals
    const [formOpen, setFormOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [editingImport, setEditingImport] = useState<Import | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedImport, setSelectedImport] = useState<Import | null>(null);
    const [excelOpen, setExcelOpen] = useState(false);
    const [excelLoading, setExcelLoading] = useState(false);

    useEffect(() => {
        fetchImports({ per_page: 9999 });
    }, [fetchImports]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // ── Filter logic ──────────────────────────────────────────────────────────
    const filteredByTab = activeTab === 'all'
        ? imports
        : imports.filter(i => i.status === activeTab);

    const filteredImports = filteredByTab.filter(i =>
        (i.code || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (i.user?.name || '').toLowerCase().includes(searchText.toLowerCase())
    );

    // ── Stats ─────────────────────────────────────────────────────────────────
    const countByStatus = (status: ImportStatus) => imports.filter(i => i.status === status).length;
    const totalGrand = imports
        .filter(i => i.status === 'completed')
        .reduce((sum, i) => sum + (Number(i.grand_total) || 0), 0);

    // ── Actions ───────────────────────────────────────────────────────────────
    const handleView = (record: Import) => {
        setSelectedImport(record);
        setDetailOpen(true);
    };

    const handleEdit = (record: Import) => {
        setEditingImport(record);
        setFormOpen(true);
    };

    const handleFormOpen = () => {
        setEditingImport(null);
        setFormOpen(true);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setEditingImport(null);
    };

    const handleFormSubmit = async (data: StoreImportRequest) => {
        setFormLoading(true);
        let success: boolean;
        if (editingImport) {
            success = await updateImport(editingImport.id, data);
        } else {
            const result = await createImport(data);
            success = result !== null;
        }
        setFormLoading(false);
        if (success) {
            handleFormClose();
        }
    };

    const handleApprove = (id: number) => changeStatus(id, 'approved');
    const handleComplete = (id: number) => changeStatus(id, 'completed');
    const handleCancel = (id: number) => changeStatus(id, 'cancelled');
    const handleDelete = (id: number) => deleteImport(id);

    const handleExcelSubmit = async (file: File) => {
        setExcelLoading(true);
        const success = await importExcel(file);
        setExcelLoading(false);
        return success;
    };

    const handleDownloadTemplate = async () => {
        try {
            const res = await importApi.downloadTemplate();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mau_nhap_kho.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            message.error('Không thể tải file mẫu');
        }
    };

    const tabItems = [
        { key: 'all', label: <><FileTextOutlined />  Tất cả <Tag>{imports.length}</Tag></> },
        { key: 'pending', label: <><ClockCircleOutlined style={{ color: '#f59e0b' }} /> Chờ duyệt <Tag color="orange">{countByStatus('pending')}</Tag></> },
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
                            <InboxOutlined style={{ color: '#6366f1', marginRight: 10 }} />
                            Quản lý nhập kho
                        </Title>
                        <Text type="secondary">Lập phiếu, duyệt và theo dõi toàn bộ đơn nhập hàng</Text>
                    </Space>
                    <Space size="middle">
                        <Input.Search
                            placeholder="Tìm mã phiếu, người lập..."
                            allowClear
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 240 }}
                        />
                        <Button
                            icon={<FileExcelOutlined />}
                            onClick={() => setExcelOpen(true)}
                            style={{
                                background: 'linear-gradient(135deg, #059669, #10b981)',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                                color: '#fff',
                                boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
                            }}
                        >
                            Import Excel
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleFormOpen}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                            }}
                        >
                            Lập phiếu nhập
                        </Button>
                    </Space>
                </div>

                {/* ── KPI Cards ── */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }}>
                            <Statistic
                                title="Tổng phiếu nhập"
                                value={imports.length}
                                prefix={<FileTextOutlined style={{ color: '#6366f1' }} />}
                                valueStyle={{ color: '#6366f1', fontWeight: 700 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }}>
                            <Statistic
                                title="Chờ duyệt"
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
                                prefix={<DollarOutlined style={{ color: '#6366f1' }} />}
                                title="Tổng tiền nhập (Hoàn thành)"
                                value={totalGrand}
                                formatter={v =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v))
                                }
                                valueStyle={{ color: '#6366f1', fontWeight: 700, fontSize: 18 }}
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
                        <ImportTable
                            imports={filteredImports}
                            loading={loading}
                            onView={handleView}
                            onEdit={handleEdit}
                            onApprove={handleApprove}
                            onComplete={handleComplete}
                            onCancel={handleCancel}
                            onDelete={handleDelete}
                        />
                    </div>
                </Card>

                {/* ── Modals ── */}
                <ImportDetailModal
                    open={detailOpen}
                    record={selectedImport}
                    onClose={() => setDetailOpen(false)}
                />

                <ImportFormModal
                    open={formOpen}
                    loading={formLoading}
                    editingImport={editingImport}
                    onSubmit={handleFormSubmit}
                    onClose={handleFormClose}
                />

                <ImportExcelModal
                    open={excelOpen}
                    loading={excelLoading}
                    onClose={() => setExcelOpen(false)}
                    onSubmit={handleExcelSubmit}
                    onDownloadTemplate={handleDownloadTemplate}
                />
            </div>
        </DashboardLayout>
    );
}
