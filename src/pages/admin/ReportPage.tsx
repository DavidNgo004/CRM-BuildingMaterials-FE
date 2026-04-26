import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import { useReport } from '../../hooks/report/useReport';
import {
    Card, Typography, Space, Tag, Button, Table, Modal, Form, Input, Badge, Row, Col, Statistic,
} from 'antd';
import {
    FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, MessageOutlined, EyeOutlined,
} from '@ant-design/icons';
import type { Report } from '../../api/report/reportApi';
import '../../styles/auth.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
    inventory: { label: 'Tồn kho', color: 'blue' },
    incident: { label: 'Sự cố', color: 'red' },
    general: { label: 'Chung', color: 'default' },
    request: { label: 'Yêu cầu', color: 'purple' },
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ xem', color: 'orange' },
    seen: { label: 'Đã xem', color: 'blue' },
    resolved: { label: 'Đã phản hồi', color: 'green' },
};

export default function AdminReportPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { reports, loading, submitLoading, fetchReports, markSeen, replyReport } = useReport();
    const [replyForm] = Form.useForm();
    const [viewRecord, setViewRecord] = useState<Report | null>(null);
    const [replyOpen, setReplyOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        document.title = 'Quản lý báo cáo';
        fetchReports();
    }, [fetchReports]);

    const handleLogout = async () => { await logout(); navigate('/login'); };

    const openReport = (record: Report) => {
        setViewRecord(record);
        if (record.status === 'pending') markSeen(record.id);
    };

    const handleReply = async () => {
        const { admin_reply } = await replyForm.validateFields();
        if (selectedId) {
            const ok = await replyReport(selectedId, admin_reply);
            if (ok) { replyForm.resetFields(); setReplyOpen(false); setSelectedId(null); }
        }
    };

    const pendingCount = reports.filter(r => r.status === 'pending').length;
    const resolvedCount = reports.filter(r => r.status === 'resolved').length;

    const columns = [
        {
            title: 'Nhân viên', key: 'user',
            render: (_: any, r: Report) => <Text strong>{r.user?.name ?? 'N/A'}</Text>,
        },
        {
            title: 'Tiêu đề', dataIndex: 'title', key: 'title',
            render: (t: string, r: Report) => (
                <Button type="link" style={{ padding: 0 }} onClick={() => openReport(r)}>
                    {r.status === 'pending' ? <Badge dot offset={[4, 0]}>{t}</Badge> : t}
                </Button>
            ),
        },
        {
            title: 'Loại', dataIndex: 'type', key: 'type',
            render: (t: string) => <Tag color={TYPE_LABEL[t]?.color}>{TYPE_LABEL[t]?.label ?? t}</Tag>,
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (s: string) => <Tag color={STATUS_LABEL[s]?.color}>{STATUS_LABEL[s]?.label ?? s}</Tag>,
        },
        {
            title: 'Ngày gửi', dataIndex: 'created_at', key: 'created_at',
            render: (d: string) => new Date(d).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Hành động', key: 'actions',
            render: (_: any, record: Report) => (
                <Space>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => openReport(record)}>Xem</Button>
                    {record.status !== 'resolved' && (
                        <Button
                            size="small"
                            icon={<MessageOutlined />}
                            style={{ color: '#6366f1', borderColor: '#6366f1' }}
                            onClick={() => { setSelectedId(record.id); setReplyOpen(true); }}
                        >
                            Phản hồi
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <DashboardLayout userName={user?.name ?? 'Admin'} onLogout={handleLogout}>
            <div className="auth-inner-page">
                <div className="auth-page-header">
                    <Space direction="vertical" size={2}>
                        <Title level={4} style={{ margin: 0 }}>
                            <FileTextOutlined style={{ color: '#6366f1', marginRight: 10 }} />
                            Quản lý báo cáo
                        </Title>
                        <Text type="secondary">Xem và phản hồi báo cáo từ nhân viên kho</Text>
                    </Space>
                    {pendingCount > 0 && (
                        <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>
                            <ClockCircleOutlined /> {pendingCount} báo cáo chưa xem
                        </Tag>
                    )}
                </div>

                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic title="Tổng báo cáo" value={reports.length}
                                prefix={<FileTextOutlined style={{ color: '#6366f1' }} />}
                                valueStyle={{ color: '#6366f1', fontWeight: 700 }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic title="Chờ xem" value={pendingCount}
                                prefix={<ClockCircleOutlined style={{ color: '#f59e0b' }} />}
                                valueStyle={{ color: '#f59e0b', fontWeight: 700 }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic title="Đã phản hồi" value={resolvedCount}
                                prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                                valueStyle={{ color: '#10b981', fontWeight: 700 }} />
                        </Card>
                    </Col>
                </Row>

                <Card style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <Table
                        columns={columns}
                        dataSource={reports}
                        rowKey="id"
                        loading={loading}
                        scroll={{ x: 700 }}
                        pagination={{ pageSize: 10 }}
                        rowClassName={(r: Report) => r.status === 'pending' ? 'report-row-pending' : ''}
                    />
                </Card>

                {/* View Modal */}
                <Modal
                    title={viewRecord?.title}
                    open={!!viewRecord}
                    onCancel={() => setViewRecord(null)}
                    footer={[
                        <Button key="close" onClick={() => setViewRecord(null)}>Đóng</Button>,
                        viewRecord?.status !== 'resolved' && (
                            <Button key="reply" type="primary"
                                style={{ background: '#6366f1' }}
                                icon={<MessageOutlined />}
                                onClick={() => { setSelectedId(viewRecord!.id); setViewRecord(null); setReplyOpen(true); }}
                            >
                                Phản hồi
                            </Button>
                        ),
                    ]}
                    width={600}
                >
                    {viewRecord && (
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Space>
                                <Tag color={TYPE_LABEL[viewRecord.type]?.color}>{TYPE_LABEL[viewRecord.type]?.label}</Tag>
                                <Tag color={STATUS_LABEL[viewRecord.status]?.color}>{STATUS_LABEL[viewRecord.status]?.label}</Tag>
                                <Text type="secondary">Gửi bởi: <b>{viewRecord.user?.name}</b></Text>
                                <Text type="secondary">{new Date(viewRecord.created_at).toLocaleDateString('vi-VN')}</Text>
                            </Space>
                            <Card size="small" style={{ background: '#f8fafc' }}>
                                <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{viewRecord.content}</Paragraph>
                            </Card>
                            {viewRecord.admin_reply && (
                                <Card size="small"
                                    title={<><MessageOutlined style={{ color: '#10b981' }} /> Phản hồi của bạn</>}
                                    style={{ borderColor: '#10b981', background: '#f0fdf4' }}
                                >
                                    <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{viewRecord.admin_reply}</Paragraph>
                                </Card>
                            )}
                        </Space>
                    )}
                </Modal>

                {/* Reply Modal */}
                <Modal
                    title={<><MessageOutlined style={{ color: '#6366f1', marginRight: 8 }} />Phản hồi báo cáo</>}
                    open={replyOpen}
                    onOk={handleReply}
                    onCancel={() => { setReplyOpen(false); replyForm.resetFields(); }}
                    okText="Gửi phản hồi"
                    cancelText="Hủy"
                    confirmLoading={submitLoading}
                    okButtonProps={{ style: { background: '#6366f1' } }}
                >
                    <Form form={replyForm} layout="vertical" style={{ marginTop: 16 }}>
                        <Form.Item name="admin_reply" label="Nội dung phản hồi" rules={[{ required: true, message: 'Nhập nội dung phản hồi' }]}>
                            <TextArea rows={5} placeholder="Nhập phản hồi của bạn..." />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
