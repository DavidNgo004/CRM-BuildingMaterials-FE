import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authContext";
import { useStaffDashboard } from "../../hooks/useStaffDashboard";
import StaffLayout from "../../components/staff/StaffLayout";
import styles from "./StaffDashboard.module.css";
import {
    BarChartOutlined, WarningOutlined, ThunderboltOutlined,
    ReloadOutlined, InboxOutlined, SendOutlined, AppstoreOutlined, AlertOutlined
} from "@ant-design/icons";
import { Modal, Table, Tag } from "antd";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
    label, value, subtitle, color, icon, isLoading,
}: {
    label: string; value: number; subtitle: string; color: string; icon: ReactNode; isLoading: boolean;
}) {
    return (
        <div className={styles.kpiCard} style={{ background: color }}>
            <div className={styles.kpiTopRow}>
                <div className={styles.kpiIcon}>{icon}</div>
                <div className={styles.kpiValue}>{isLoading ? "—" : value}</div>
            </div>
            <div className={styles.kpiLabel}>{label}</div>
            <div className={styles.kpiSub}>{subtitle}</div>
        </div>
    );
}

// ── Low Stock Table ───────────────────────────────────────────────────────────
function LowStockTable({ data, isLoading }: {
    data: { id: number; name: string; unit: string; current_stock: number; reorder_level: number; status: string }[];
    isLoading: boolean;
}) {
    const statusConfig = {
        critical: { label: "Hết hàng", color: "error" },
        low: { label: "Sắp hết", color: "warning" },
        normal: { label: "Bình thường", color: "success" },
    } as const;

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tên Sản Phẩm</th>
                        <th>Đơn Vị</th>
                        <th>Tồn Kho</th>
                        <th>Mức Tối Thiểu</th>
                        <th>Trạng Thái</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <tr key={i}>
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <td key={j}><div className={styles.skeletonRow} /></td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={5} className={styles.emptyCell}>Không có sản phẩm nào</td>
                        </tr>
                    ) : (
                        data.map(item => {
                            const cfg = statusConfig[item.status as keyof typeof statusConfig] ?? statusConfig.normal;
                            return (
                                <tr key={item.id}>
                                    <td className={styles.productName}>{item.name}</td>
                                    <td>{item.unit}</td>
                                    <td><b style={{ color: item.status === 'critical' ? '#dc2626' : item.status === 'low' ? '#d97706' : '#16a34a' }}>{item.current_stock}</b></td>
                                    <td>{item.reorder_level}</td>
                                    <td>
                                        <Tag color={cfg.color}>{cfg.label}</Tag>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ── Modal All Low Stock ────────────────────────────────────────────────────────
function LowStockModal({ open, onClose, data }: {
    open: boolean;
    onClose: () => void;
    data: { id: number; name: string; unit: string; current_stock: number; reorder_level: number; status: string }[];
}) {
    const columns = [
        { title: 'Tên Sản Phẩm', dataIndex: 'name', key: 'name', render: (t: string) => <b>{t}</b> },
        { title: 'Đơn Vị', dataIndex: 'unit', key: 'unit' },
        {
            title: 'Tồn Kho', dataIndex: 'current_stock', key: 'current_stock',
            render: (v: number, r: any) => (
                <span style={{ fontWeight: 700, color: r.status === 'critical' ? '#dc2626' : '#d97706' }}>{v}</span>
            )
        },
        { title: 'Mức Tối Thiểu', dataIndex: 'reorder_level', key: 'reorder_level' },
        {
            title: 'Trạng Thái', dataIndex: 'status', key: 'status',
            render: (s: string) => (
                <Tag color={s === 'critical' ? 'error' : 'warning'}>
                    {s === 'critical' ? 'Hết hàng' : 'Sắp hết'}
                </Tag>
            )
        },
    ];

    return (
        <Modal
            title={<><AlertOutlined style={{ color: '#f59e0b', marginRight: 8 }} />Tất cả sản phẩm sắp hết / hết hàng</>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={720}
            destroyOnClose
        >
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                size="small"
                pagination={{ pageSize: 10 }}
            />
        </Modal>
    );
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────
export default function StaffDashboard() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const { kpi, stockChart, lowStockProducts, isLoading, refresh } = useStaffDashboard();
    const [lowStockModalOpen, setLowStockModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Dashboard - Kho VLXD";
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    // Merge import & export into chart data for grouped bar chart
    const chartData = stockChart.map(d => ({
        date: d.date,
        'Nhập kho': d.quantity,
        'Xuất kho': Math.max(0, d.quantity - Math.floor(Math.random() * 8 + 2)), // mock export
    }));

    const criticalCount = lowStockProducts.filter(p => p.status === 'critical').length;
    const lowCount = lowStockProducts.filter(p => p.status === 'low').length;

    return (
        <StaffLayout onLogout={handleLogout}>
            <div className={styles.page}>

                {/* ── Page Header ── */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Chào mừng, {user?.name ?? "Nhân viên kho"}</h1>
                        <p className={styles.pageSubtitle}>Tổng quan kho hàng hôm nay</p>
                    </div>
                    <button className={styles.refreshBtn} onClick={refresh} disabled={isLoading}>
                        <ReloadOutlined spin={isLoading} />
                        Làm mới
                    </button>
                </div>

                {/* ── KPI Cards ── */}
                <section className={styles.kpiRow}>
                    <KpiCard
                        label="Tổng Sản Phẩm"
                        value={kpi?.san_pham_nhap_hom_nay ?? 0}
                        subtitle="Loại vật liệu trong kho"
                        color="linear-gradient(135deg, #6366f1, #4f46e5)"
                        icon={<AppstoreOutlined />}
                        isLoading={isLoading}
                    />
                    <KpiCard
                        label="Đơn Nhập Hôm Nay"
                        value={kpi?.dat_hang_hom_nay ?? 0}
                        subtitle="Phiếu nhập được tạo"
                        color="linear-gradient(135deg, #10b981, #059669)"
                        icon={<InboxOutlined />}
                        isLoading={isLoading}
                    />
                    <KpiCard
                        label="Đơn Xuất Hôm Nay"
                        value={kpi?.nhap_tu_ngay_nay ?? 0}
                        subtitle="Phiếu xuất được tạo"
                        color="linear-gradient(135deg, #f59e0b, #d97706)"
                        icon={<SendOutlined />}
                        isLoading={isLoading}
                    />
                    <KpiCard
                        label="Sản Phẩm Cần Nhập"
                        value={kpi?.nhap_them_hom_nay ?? 0}
                        subtitle="Dưới mức tồn kho tối thiểu"
                        color="linear-gradient(135deg, #ef4444, #dc2626)"
                        icon={<AlertOutlined />}
                        isLoading={isLoading}
                    />
                </section>

                {/* ── Main Grid ── */}
                <div className={styles.mainGrid}>

                    {/* ── Left: Bar Chart ── */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}><BarChartOutlined style={{ color: "#6366f1", marginRight: 8 }} />Biểu Đồ Nhập / Xuất Kho 10 Ngày Gần Nhất</h2>
                            <span className={styles.cardTag}>10 ngày gần nhất</span>
                        </div>
                        {isLoading ? (
                            <div className={styles.chartSkeleton} />
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="Nhập kho" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Xuất kho" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* ── Right: Activity Summary ── */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}><ThunderboltOutlined style={{ color: "#f59e0b", marginRight: 8 }} />Tóm Tắt Hoạt Động</h2>
                        </div>
                        <div className={styles.activityList}>
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className={styles.activitySkeleton} />
                                ))
                            ) : (
                                <>
                                    <div className={styles.activityItem}>
                                        <div className={styles.activityDot} style={{ background: "#6366f1" }} />
                                        <div className={styles.activityContent}>
                                            <span className={styles.activityLabel}>Tổng loại sản phẩm</span>
                                            <span className={styles.activityValue}>{kpi?.san_pham_nhap_hom_nay ?? 0} loại</span>
                                        </div>
                                    </div>
                                    <div className={styles.activityItem}>
                                        <div className={styles.activityDot} style={{ background: "#10b981" }} />
                                        <div className={styles.activityContent}>
                                            <span className={styles.activityLabel}>Đơn nhập hôm nay</span>
                                            <span className={styles.activityValue} style={{ color: "#059669" }}>{kpi?.dat_hang_hom_nay ?? 0} đơn</span>
                                        </div>
                                    </div>
                                    <div className={styles.activityItem}>
                                        <div className={styles.activityDot} style={{ background: "#f59e0b" }} />
                                        <div className={styles.activityContent}>
                                            <span className={styles.activityLabel}>Đơn xuất hôm nay</span>
                                            <span className={styles.activityValue} style={{ color: "#d97706" }}>{kpi?.nhap_tu_ngay_nay ?? 0} đơn</span>
                                        </div>
                                    </div>
                                    <div className={styles.activityItem}>
                                        <div className={styles.activityDot} style={{ background: "#f97316" }} />
                                        <div className={styles.activityContent}>
                                            <span className={styles.activityLabel}>Sắp hết hàng</span>
                                            <span className={styles.activityValue} style={{ color: "#ea580c" }}>{lowCount} sản phẩm</span>
                                        </div>
                                    </div>
                                    <div className={styles.activityItem}>
                                        <div className={styles.activityDot} style={{ background: "#ef4444" }} />
                                        <div className={styles.activityContent}>
                                            <span className={styles.activityLabel}>Hết hàng hoàn toàn</span>
                                            <span className={styles.activityValue} style={{ color: "#dc2626" }}>{criticalCount} sản phẩm</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Low Stock Table ── */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}><WarningOutlined style={{ color: "#f59e0b", marginRight: 8 }} />Sản Phẩm Sắp Hết Hàng</h2>
                        <button
                            className={styles.viewAllBtn}
                            onClick={() => setLowStockModalOpen(true)}
                        >
                            Xem tất cả →
                        </button>
                    </div>
                    <LowStockTable data={lowStockProducts.slice(0, 5)} isLoading={isLoading} />
                </div>

            </div>

            <LowStockModal
                open={lowStockModalOpen}
                onClose={() => setLowStockModalOpen(false)}
                data={lowStockProducts}
            />
        </StaffLayout>
    );
}