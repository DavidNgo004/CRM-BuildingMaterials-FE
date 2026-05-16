import { useEffect, useState } from 'react';
import {
    Table, Card, Typography, Tag, Space, DatePicker,
    Select, Input, Button, Modal, Descriptions, Divider
} from 'antd';
import {
    HistoryOutlined, SearchOutlined, EyeOutlined,
    UserOutlined, CalendarOutlined, RocketOutlined,
    SwapOutlined
} from '@ant-design/icons';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import { useActivityLog } from '../../hooks/activityLog/useActivityLog';
import type { ActivityLog } from '../../api/activityLog/activityLogApi';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ACTION_MAP: Record<string, { label: string, color: string }> = {
    'CREATE_IMPORT': { label: 'Tạo phiếu nhập', color: 'cyan' },
    'UPDATE_IMPORT': { label: 'Sửa phiếu nhập', color: 'blue' },
    'APPROVE_IMPORT': { label: 'Duyệt phiếu nhập', color: 'geekblue' },
    'COMPLETE_IMPORT': { label: 'Hoàn thành nhập', color: 'green' },
    'CANCEL_IMPORT': { label: 'Hủy phiếu nhập', color: 'volcano' },
    'DELETE_IMPORT': { label: 'Xóa phiếu nhập', color: 'red' },

    'CREATE_EXPORT': { label: 'Tạo phiếu xuất', color: 'cyan' },
    'APPROVE_EXPORT': { label: 'Duyệt phiếu xuất', color: 'geekblue' },
    'CANCEL_EXPORT': { label: 'Hủy phiếu xuất', color: 'volcano' },
    'DELETE_EXPORT': { label: 'Xóa phiếu xuất', color: 'red' },

    'CREATE_PRODUCT': { label: 'Thêm sản phẩm', color: 'purple' },
    'UPDATE_PRODUCT': { label: 'Sửa sản phẩm', color: 'magenta' },
    'DELETE_PRODUCT': { label: 'Xóa sản phẩm', color: 'red' },

    'CREATE_EXPENSE': { label: 'Thêm chi phí', color: 'orange' },
    'UPDATE_EXPENSE': { label: 'Sửa chi phí', color: 'gold' },
    'DELETE_EXPENSE': { label: 'Xóa chi phí', color: 'red' },
};

const ENTITY_MAP: Record<string, string> = {
    'product': 'Sản phẩm',
    'import': 'Nhập kho',
    'export': 'Xuất kho',
    'expense': 'Chi phí',
};

export default function ActivityLogPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { logs, pagination, loading, fetchLogs } = useActivityLog();

    const [detailModal, setDetailModal] = useState<{ open: boolean, data: ActivityLog | null }>({
        open: false,
        data: null
    });

    const [filters, setFilters] = useState({
        page: 1,
        per_page: 10,
        search: '',
        entity_type: undefined,
        action: undefined,
        from: undefined as string | undefined,
        to: undefined as string | undefined,
    });

    useEffect(() => {
        document.title = 'Lịch sử hoạt động | CRM VLXD';
        fetchLogs(filters);
    }, [fetchLogs, filters]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const renderJson = (data: any) => {
        if (!data) return <Text type="secondary">N/A</Text>;
        return (
            <pre style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                border: '1px solid #e2e8f0',
                maxHeight: '200px',
                overflow: 'auto'
            }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        );
    };

    const columns = [
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            render: (date: string) => (
                <Space>
                    <CalendarOutlined style={{ color: '#6366f1' }} />
                    <Text strong>{dayjs(date).format('DD/MM/YYYY HH:mm:ss')}</Text>
                </Space>
            )
        },
        {
            title: 'Người thực hiện',
            key: 'user',
            width: 200,
            render: (_: any, record: ActivityLog) => (
                <Space direction="vertical" size={0}>
                    <Space>
                        <UserOutlined />
                        <Text strong>{record.user_name || 'Hệ thống'}</Text>
                    </Space>
                    <Tag color={record.user_role === 'admin' ? 'red' : 'blue'} style={{ fontSize: '10px' }}>
                        {record.user_role === 'admin' ? 'ADMIN' : 'KHO'}
                    </Tag>
                </Space>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 180,
            render: (_: any, record: ActivityLog) => {
                const config = ACTION_MAP[record.action] || { label: record.action, color: 'default' };
                return <Tag color={config.color} style={{ fontWeight: 600 }}>{config.label}</Tag>;
            }
        },
        {
            title: 'Đối tượng',
            key: 'entity',
            width: 150,
            render: (_: any, record: ActivityLog) => (
                <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{ENTITY_MAP[record.entity_type] || record.entity_type}</Text>
                    <Text strong>ID: #{record.entity_id}</Text>
                </Space>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Chi tiết',
            key: 'action_btn',
            width: 100,
            render: (_: any, record: ActivityLog) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => setDetailModal({ open: true, data: record })}
                />
            )
        }
    ];

    return (
        <DashboardLayout userName={user?.name ?? 'Admin'} onLogout={handleLogout}>
            <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space direction="vertical" size={0}>
                        <Title level={3} style={{ margin: 0 }}>
                            <HistoryOutlined style={{ color: '#6366f1', marginRight: '12px' }} />
                            Lịch sử hoạt động
                        </Title>
                        <Text type="secondary">Theo dõi mọi thay đổi trong hệ thống (Production Log Standard)</Text>
                    </Space>
                </div>

                <Card style={{ marginBottom: '24px', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <Space wrap size="middle">
                        <Input
                            placeholder="Tìm kiếm nội dung..."
                            prefix={<SearchOutlined />}
                            style={{ width: 250 }}
                            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                        />
                        <Select
                            placeholder="Loại đối tượng"
                            style={{ width: 150 }}
                            allowClear
                            onChange={(val) => setFilters(f => ({ ...f, entity_type: val, page: 1 }))}
                            options={Object.entries(ENTITY_MAP).map(([k, v]) => ({ value: k, label: v }))}
                        />
                        <Select
                            placeholder="Hành động"
                            style={{ width: 200 }}
                            allowClear
                            onChange={(val) => setFilters(f => ({ ...f, action: val, page: 1 }))}
                            options={Object.entries(ACTION_MAP).map(([k, v]) => ({ value: k, label: v.label }))}
                        />
                        <RangePicker
                            onChange={(dates) => {
                                setFilters(f => ({
                                    ...f,
                                    from: dates ? dates[0]?.format('YYYY-MM-DD') : undefined,
                                    to: dates ? dates[1]?.format('YYYY-MM-DD') : undefined,
                                    page: 1
                                }));
                            }}
                        />
                    </Space>
                </Card>

                <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={columns}
                        dataSource={logs}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            current: pagination?.current_page,
                            pageSize: pagination?.per_page,
                            total: pagination?.total,
                            onChange: (page) => setFilters(f => ({ ...f, page })),
                            showSizeChanger: false,
                        }}
                    />
                </Card>
            </div>

            {/* Modal Chi tiết log - ĐIỂM CỘNG 8+ */}
            <Modal
                title={
                    <Space>
                        <RocketOutlined style={{ color: '#6366f1' }} />
                        <span>Chi tiết hoạt động #{detailModal.data?.id}</span>
                    </Space>
                }
                open={detailModal.open}
                onCancel={() => setDetailModal({ open: false, data: null })}
                footer={null}
                width={800}
                centered
            >
                {detailModal.data && (
                    <div>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Thời gian">{dayjs(detailModal.data.created_at).format('DD/MM/YYYY HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="Người làm">{detailModal.data.user_name} ({detailModal.data.user_role})</Descriptions.Item>
                            <Descriptions.Item label="IP">{detailModal.data.ip_address}</Descriptions.Item>
                            <Descriptions.Item label="Action">{detailModal.data.action}</Descriptions.Item>
                        </Descriptions>

                        <Divider plain>
                            <Space><SwapOutlined /> <Text strong>So sánh Dữ liệu Trước & Sau</Text></Space>
                        </Divider>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <Text type="secondary" strong>Dữ liệu TRƯỚC (Before):</Text>
                                {renderJson(detailModal.data.old_data)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <Text strong style={{ color: '#10b981' }}>Dữ liệu SAU (After):</Text>
                                {renderJson(detailModal.data.new_data)}
                            </div>
                        </div>

                        {detailModal.data.description && (
                            <div style={{ marginTop: '16px' }}>
                                <Text type="secondary">Tóm tắt:</Text>
                                <div style={{ padding: '8px', borderLeft: '4px solid #6366f1', background: '#f5f7ff', marginTop: '4px' }}>
                                    {detailModal.data.description}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
