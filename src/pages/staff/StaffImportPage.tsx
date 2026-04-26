import { useEffect, useState } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import StaffImportForm from "../../components/staff/import/StaffImportForm";
import StaffImportListTab from "../../components/staff/import/StaffImportListTab";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";
import { Tabs, Card, Tag, Typography, Space, Button, Tooltip } from "antd";
import { ImportOutlined, RobotOutlined, CiOutlined, BulbOutlined, ReloadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import axiosClient from "../../api/axiosClient";
import styles from "./StaffImportPage.module.css";

const { Text } = Typography;

interface AISuggestion {
    product_id: number;
    product_name: string;
    unit: string;
    current_stock: number;
    reorder_level: number;
    suggested_qty: number;
    message: string;
}

function AiSuggestionTab() {
    const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/dashboard/alerts');
            setSuggestions(res.data?.suggestions ?? []);
            setAlerts(res.data?.alerts ?? []);
        } catch {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const levelColor: Record<string, string> = {
        critical: 'red',
        warning: 'orange',
        info: 'blue',
    };

    return (
        <div style={{ padding: '8px 0' }}>
            {/* AI Suggestions */}
            <Card
                loading={loading}
                title={
                    <Space>
                        <RobotOutlined style={{ color: '#6366f1' }} />
                        <Text strong style={{ color: '#6366f1' }}>Gợi ý nhập hàng từ AI</Text>
                        <Tag color="purple">{suggestions.length} gợi ý</Tag>
                    </Space>
                }
                extra={<Button size="small" icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>}
                style={{ marginBottom: 16, borderColor: '#a78bfa', background: '#f5f3ff' }}
            >
                {suggestions.length === 0 ? (
                    <Text type="secondary">✅ Tồn kho đang ổn định, không có gợi ý nhập hàng.</Text>
                ) : (
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, flexWrap: 'wrap' }}>
                        {suggestions.map(s => (
                            <Card
                                key={s.product_id}
                                size="small"
                                style={{ minWidth: 200, maxWidth: 220, flex: '0 0 auto', borderColor: '#c4b5fd', background: '#faf5ff' }}
                                hoverable
                            >
                                <Space direction="vertical" size={4}>
                                    <Text strong ellipsis style={{ maxWidth: 200, display: 'block' }}>
                                        <BulbOutlined style={{ color: '#eab308', marginRight: 4 }} />
                                        {s.product_name}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        Tồn: {s.current_stock} / Ngưỡng: {s.reorder_level} {s.unit}
                                    </Text>
                                    <Tag color="purple">
                                        <ArrowRightOutlined /> Gợi ý nhập: {s.suggested_qty} {s.unit}
                                    </Tag>
                                </Space>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>

            {/* Inventory Alerts */}
            <Card
                title={
                    <Space>
                        <RobotOutlined style={{ color: '#f59e0b' }} />
                        <Text strong>Cảnh báo tồn kho</Text>
                        <Tag color="orange">{alerts.length} cảnh báo</Tag>
                    </Space>
                }
                style={{ borderColor: '#fcd34d', background: '#fffbeb' }}
                loading={loading}
            >
                {alerts.length === 0 ? (
                    <Text type="secondary">✅ Không có cảnh báo nào</Text>
                ) : (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {alerts.slice(0, 10).map((a, i) => (
                            <div key={i} style={{
                                padding: '8px 12px',
                                borderRadius: 8,
                                background: a.level === 'critical' ? '#fef2f2' : a.level === 'warning' ? '#fffbeb' : '#eff6ff',
                                borderLeft: `3px solid ${a.level === 'critical' ? '#ef4444' : a.level === 'warning' ? '#f59e0b' : '#3b82f6'}`,
                                fontSize: 13,
                            }}>
                                <Tag color={levelColor[a.level] ?? 'default'} style={{ marginRight: 8 }}>
                                    {a.level === 'critical' ? 'Nghiêm trọng' : a.level === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                                </Tag>
                                {a.message}
                            </div>
                        ))}
                    </Space>
                )}
            </Card>
        </div>
    );
}

export default function StaffImportPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Nhập kho - Kho VLXD";
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const tabItems = [
        {
            key: 'create',
            label: <span><ImportOutlined /> Tạo Phiếu Nhập</span>,
            children: <StaffImportForm />,
        },
        {
            key: 'list',
            label: <span><CiOutlined /> Danh Sách Đơn Nhập</span>,
            children: <StaffImportListTab />,
        },
        {
            key: 'ai',
            label: <span><RobotOutlined /> AI Gợi Ý</span>,
            children: <AiSuggestionTab />,
        },
    ];

    return (
        <StaffLayout onLogout={handleLogout}>
            <div className={styles.page}>
                <h2 className={styles.pageTitle}>Quản lý Nhập Kho</h2>
                <Tabs defaultActiveKey="create" items={tabItems} size="large" />
            </div>
        </StaffLayout>
    );
}
