import { useEffect, useState } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import StaffInventoryTable from "../../components/staff/inventory/StaffInventoryTable";
import { useInventoryLog } from "../../hooks/inventory/useInventoryLog";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Space, Input, Select, Row, Col, Statistic, DatePicker } from 'antd';
import { StockOutlined, InboxOutlined, SendOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import '../../styles/auth.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function StaffInventoryPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { logs, loading, fetchLogs } = useInventoryLog();
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'import' | 'export'>('all');
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

    useEffect(() => {
        document.title = "Lịch sử xuất nhập kho - Kho VLXD";
        fetchLogs({ per_page: 500 });
    }, [fetchLogs]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        const range: [Dayjs | null, Dayjs | null] = dates ? [dates[0], dates[1]] : [null, null];
        setDateRange(range);
    };

    const filteredLogs = logs.filter(log => {
        const matchSearch = !searchText ||
            (log.product?.name?.toLowerCase() || '').includes(searchText.toLowerCase());
        const matchType = typeFilter === 'all' || log.type === typeFilter;
        const logDate = new Date(log.created_at);
        const matchFromDate = !dateRange[0] || logDate >= dateRange[0].toDate();
        const matchToDate = !dateRange[1] || logDate <= dateRange[1].endOf('day').toDate();
        return matchSearch && matchType && matchFromDate && matchToDate;
    });

    const importCount = logs.filter(l => l.type === 'import').length;
    const exportCount = logs.filter(l => l.type === 'export').length;

    return (
        <StaffLayout onLogout={handleLogout}>
            <div className="auth-inner-page">
                {/* ── Header ── */}
                <div className="auth-page-header">
                    <Space direction="vertical" size={2}>
                        <Title level={4} style={{ margin: 0 }}>
                            <StockOutlined style={{ color: '#6366f1', marginRight: 10 }} />
                            Lịch sử xuất nhập kho
                        </Title>
                        <Text type="secondary">Theo dõi toàn bộ biến động nhập và xuất vật liệu</Text>
                    </Space>
                </div>

                {/* ── Filters ── */}
                <Row gutter={[12, 12]} style={{ marginBottom: 20, alignItems: 'center' }}>
                    <Col xs={24} sm={10} md={8}>
                        <Input.Search
                            placeholder="Tìm theo tên sản phẩm..."
                            allowClear
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            value={typeFilter}
                            onChange={v => setTypeFilter(v)}
                            style={{ width: '100%' }}
                        >
                            <Option value="all">Tất cả</Option>
                            <Option value="import">Nhập kho</Option>
                            <Option value="export">Xuất kho</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={10}>
                        <RangePicker
                            style={{ width: '100%' }}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            format="DD/MM/YYYY"
                            onChange={(dates) => handleDateChange(dates as [Dayjs | null, Dayjs | null] | null)}
                        />
                    </Col>
                </Row>

                {/* ── Stats ── */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic
                                title="Tổng giao dịch"
                                value={filteredLogs.length}
                                prefix={<StockOutlined style={{ color: '#6366f1' }} />}
                                valueStyle={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic
                                title="Lần nhập kho"
                                value={importCount}
                                prefix={<InboxOutlined style={{ color: '#10b981' }} />}
                                valueStyle={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
                            <Statistic
                                title="Lần xuất kho"
                                value={exportCount}
                                prefix={<SendOutlined style={{ color: '#f59e0b' }} />}
                                valueStyle={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* ── Table ── */}
                <Card style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: 'none' }}>
                    <StaffInventoryTable logs={filteredLogs} loading={loading} />
                </Card>
            </div>
        </StaffLayout>
    );
}
