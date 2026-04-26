import { useEffect, useState } from 'react';
import StaffLayout from '../../components/staff/StaffLayout';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import { useReport } from '../../hooks/report/useReport';
import {
    Card, Typography, Space, Tag, Form, Input, Select, Button, Table, Modal, Row, Col,
} from 'antd';
import {
    FileTextOutlined, PlusOutlined, SendOutlined, ClockCircleOutlined,
    CheckCircleOutlined, MessageOutlined,
} from '@ant-design/icons';
import type { Report } from '../../api/report/reportApi';
import '../../styles/auth.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
    inventory: { label: 'Tồn kho', color: 'blue' },
    incident: { label: 'Sự cố', color: 'red' },
    general: { label: 'Chung', color: 'default' },
    request: { label: 'Yêu cầu', color: 'purple' },
};

const STATUS_LABEL: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Chờ xem', color: 'orange', icon: <ClockCircleOutlined /> },
    seen: { label: 'Đã xem', color: 'blue', icon: <CheckCircleOutlined /> },
    resolved: { label: 'Đã phản hồi', color: 'green', icon: <MessageOutlined /> },
};

export default function StaffReportPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { reports, loading, submitLoading, fetchReports, createReport } = useReport();
    const [form] = Form.useForm();
    const [formOpen, setFormOpen] = useState(false);
    const [viewRecord, setViewRecord] = useState<Report | null>(null);

    useEffect(() => {
        document.title = 'Báo cáo - Kho VLXD';
        fetchReports();
    }, [fetchReports]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();
        const ok = await createReport(values);
        if (ok) {
            form.resetFields();
            setFormOpen(false);
        }
    };

    const pendingCount = reports.filter(r => r.status === 'pending').length;
    const resolvedCount = reports.filter(r => r.status === 'resolved').length;

    const columns = [
        {
            title: 'Tiêu đề', dataIndex: 'title', key: 'title',
            render: (t: string, r: Report) => (
                <Button type="link" style={{ padding: 0, fontWeight: 600 }} onClick={() => setViewRecord(r)}>
                    {t}
                </Button>
            ),
        },
        {
            title: 'Loại', dataIndex: 'type', key: 'type',
            render: (t: string) => <Tag color={TYPE_LABEL[t]?.color}>{TYPE_LABEL[t]?.label ?? t}</Tag>,
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (s: string) => (
                <Tag icon={STATUS_LABEL[s]?.icon} color={STATUS_LABEL[s]?.color}>
                    {STATUS_LABEL[s]?.label ?? s}
                </Tag>
            ),
        },
        {
            title: 'Ngày gửi', dataIndex: 'created_at', key: 'created_at',
            render: (d: string) => new Date(d).toLocaleDateString('vi-VN'),
        },
    ];

    return (
        <StaffLayout onLogout={handleLogout}>
            <div className="auth-inner-page">
                {/* Header */}
                <div className="auth-page-header">
                    <Space direction="vertical" size={2}>
                        <Title level={4} style={{ margin: 0 }}>
                            <FileTextOutlined style={{ color: '#6366f1', marginRight: 10 }} />
                            Báo cáo cho Admin
                        </Title>
                        <Text type="secondary">Gửi báo cáo, yêu cầu và sự cố đến quản trị viên</Text>
                    </Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setFormOpen(true)}
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: 8 }}
                    >
                        Tạo báo cáo mới
                    </Button>
                </div>

                {/* Stats */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Space>
                                <FileTextOutlined style={{ fontSize: 28, color: '#6366f1' }} />
                                <div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>{reports.length}</div>
                                    <Text type="secondary">Tổng báo cáo</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Space>
                                <ClockCircleOutlined style={{ fontSize: 28, color: '#f59e0b' }} />
                                <div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{pendingCount}</div>
                                    <Text type="secondary">Chờ xem</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Space>
                                <CheckCircleOutlined style={{ fontSize: 28, color: '#10b981' }} />
                                <div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{resolvedCount}</div>
                                    <Text type="secondary">Đã phản hồi</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Table */}
                <Card style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <Table
                        columns={columns}
                        dataSource={reports}
                        rowKey="id"
                        loading={loading}
                        scroll={{ x: 600 }}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>

                {/* Create Report Modal */}
                <Modal
                    title={<><SendOutlined style={{ color: '#6366f1', marginRight: 8 }} />Tạo báo cáo mới</>}
                    open={formOpen}
                    onOk={handleSubmit}
                    onCancel={() => { setFormOpen(false); form.resetFields(); }}
                    okText="Gửi báo cáo"
                    cancelText="Hủy"
                    confirmLoading={submitLoading}
                    okButtonProps={{ style: { background: '#6366f1' } }}
                >
                    <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                        <Form.Item name="type" label="Loại báo cáo" rules={[{ required: true }]}>
                            <Select placeholder="Chọn loại báo cáo">
                                <Option value="inventory">Tồn kho</Option>
                                <Option value="incident">Sự cố</Option>
                                <Option value="request">Yêu cầu</Option>
                                <Option value="general">Chung</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
                            <Input placeholder="Tiêu đề báo cáo..." />
                        </Form.Item>
                        <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Nhập nội dung' }]}>
                            <TextArea rows={5} placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..." />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* View Report Modal */}
                <Modal
                    title={viewRecord?.title}
                    open={!!viewRecord}
                    onCancel={() => setViewRecord(null)}
                    footer={null}
                    width={600}
                >
                    {viewRecord && (
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Space>
                                <Tag color={TYPE_LABEL[viewRecord.type]?.color}>{TYPE_LABEL[viewRecord.type]?.label}</Tag>
                                <Tag icon={STATUS_LABEL[viewRecord.status]?.icon} color={STATUS_LABEL[viewRecord.status]?.color}>
                                    {STATUS_LABEL[viewRecord.status]?.label}
                                </Tag>
                                <Text type="secondary">{new Date(viewRecord.created_at).toLocaleDateString('vi-VN')}</Text>
                            </Space>
                            <Card size="small" style={{ background: '#f8fafc' }}>
                                <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{viewRecord.content}</Paragraph>
                            </Card>
                            {viewRecord.admin_reply && (
                                <Card
                                    size="small"
                                    title={<><MessageOutlined style={{ color: '#10b981' }} /> Phản hồi từ Admin</>}
                                    style={{ borderColor: '#10b981', background: '#f0fdf4' }}
                                >
                                    <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{viewRecord.admin_reply}</Paragraph>
                                </Card>
                            )}
                        </Space>
                    )}
                </Modal>
            </div>
        </StaffLayout>
    );
}
