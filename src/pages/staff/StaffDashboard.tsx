import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authContext";
import { useStaffDashboard } from "../../hooks/useStaffDashboard";
import StaffLayout from "../../components/staff/StaffLayout";
import styles from "./StaffDashboard.module.css";
import { BarChartOutlined, WarningOutlined, ThunderboltOutlined, ProductOutlined, ShoppingCartOutlined, ImportOutlined, StockOutlined } from "@ant-design/icons";

// ── Mini Chart Component ──────────────────────────────────────────────────────
function MiniSparkline({ data }: { data: { date: string; quantity: number }[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.quantity));
  const min = Math.min(...data.map(d => d.quantity));
  const range = max - min || 1;
  const W = 280;
  const H = 80;
  const padX = 8;
  const padY = 8;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * innerW;
    const y = padY + innerH - ((d.quantity - min) / range) * innerH;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const fillArea = `${padX},${H - padY} ${points.join(" ")} ${W - padX},${H - padY}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={styles.sparkline}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={fillArea} fill="url(#sparkGrad)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => {
        const [x, y] = points[i].split(",").map(Number);
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />
        );
      })}
    </svg>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, color, icon, isLoading,
}: {
  label: string; value: number; color: string; icon: ReactNode; isLoading: boolean;
}) {
  return (
    <div className={styles.kpiCard} style={{ background: color }}>
      <div className={styles.kpiIcon}>{icon}</div>
      <div className={styles.kpiValue}>{isLoading ? "—" : value}</div>
      <div className={styles.kpiLabel}>{label}</div>
    </div>
  );
}

// ── Low Stock Table ───────────────────────────────────────────────────────────
function LowStockTable({ data, isLoading }: {
  data: { id: number; name: string; unit: string; current_stock: number; reorder_level: number; status: string }[];
  isLoading: boolean;
}) {
  const statusConfig = {
    critical: { label: "Hết hàng", bg: "#fee2e2", color: "#dc2626" },
    low: { label: "Sắp hết", bg: "#fef3c7", color: "#d97706" },
    normal: { label: "Bình thường", bg: "#dcfce7", color: "#16a34a" },
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
                  <td><b>{item.current_stock}</b></td>
                  <td>{item.reorder_level}</td>
                  <td>
                    <span className={styles.badge} style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
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

// ── Main Dashboard Page ───────────────────────────────────────────────────────
export default function StaffDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { kpi, stockChart, lowStockProducts, isLoading, refresh } = useStaffDashboard();

  useEffect(() => {
    document.title = "Dashboard - Kho VLXD";
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <StaffLayout onLogout={handleLogout}>
      <div className={styles.page}>

        {/* ── Page Header ── */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Chào Mừng, {user?.name ?? "Warehouse Staff"} 👋</h1>
            <p className={styles.pageSubtitle}>Tổng quan kho hàng hôm nay</p>
          </div>
          <button className={styles.refreshBtn} onClick={refresh} disabled={isLoading}>
            <span className={isLoading ? styles.spinning : ""}>↻</span>
            Làm mới
          </button>
        </div>

        {/* ── KPI Cards ── */}
        <section className={styles.kpiRow}>
          <KpiCard
            label="Sản Phẩm"
            value={kpi?.san_pham_nhap_hom_nay ?? 0}
            color="linear-gradient(135deg, #6366f1, #4f46e5)"
            icon={<ProductOutlined />}
            isLoading={isLoading}
          />
          <KpiCard
            label="Đặt Hàng Hàng"
            value={kpi?.dat_hang_hom_nay ?? 0}
            color="linear-gradient(135deg, #f59e0b, #d97706)"
            icon={<ShoppingCartOutlined />}
            isLoading={isLoading}
          />
          <KpiCard
            label="Nhập Từ Hôm Nay"
            value={kpi?.nhap_them_hom_nay ?? 0}
            color="linear-gradient(135deg, #10b981, #059669)"
            icon={<ImportOutlined />}
            isLoading={isLoading}
          />
          <KpiCard
            label="Nhập Hôm Nay"
            value={kpi?.nhap_tu_ngay_nay ?? 0}
            color="linear-gradient(135deg, #ec4899, #db2777)"
            icon={<StockOutlined />}
            isLoading={isLoading}
          />
        </section>

        {/* ── Main Grid ── */}
        <div className={styles.mainGrid}>

          {/* ── Left: Stock Chart ── */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><BarChartOutlined style={{ color: "#f59e0b" }} /> Biểu Đồ Nhập Kho Theo Ngày</h2>
              <span className={styles.cardTag}>10 ngày gần nhất</span>
            </div>

            {isLoading ? (
              <div className={styles.chartSkeleton} />
            ) : (
              <div className={styles.chartArea}>
                {/* Y-axis labels */}
                <div className={styles.chartContainer}>
                  <MiniSparkline data={stockChart} />
                  {/* X-axis labels */}
                  <div className={styles.xAxis}>
                    {stockChart.filter((_, i) => i % 2 === 0).map((d, i) => (
                      <span key={i} className={styles.xLabel}>{d.date}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Activity Summary ── */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><ThunderboltOutlined style={{ color: "#f59e0b" }} /> Hoạt Động Kho</h2>
            </div>
            <div className={styles.activityList}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={styles.activitySkeleton} />
                ))
              ) : (
                <>
                  <div className={styles.activityItem}>
                    <div className={styles.activityDot} style={{ background: "#6366f1" }} />
                    <div className={styles.activityContent}>
                      <span className={styles.activityLabel}>Tổng sản phẩm trong kho</span>
                      <span className={styles.activityValue}>{kpi?.san_pham_nhap_hom_nay ?? 0} loại</span>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityDot} style={{ background: "#f59e0b" }} />
                    <div className={styles.activityContent}>
                      <span className={styles.activityLabel}>Sản phẩm cần nhập thêm</span>
                      <span className={styles.activityValue} style={{ color: "#d97706" }}>
                        {lowStockProducts.filter(p => p.status !== "normal").length} sản phẩm
                      </span>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityDot} style={{ background: "#ef4444" }} />
                    <div className={styles.activityContent}>
                      <span className={styles.activityLabel}>Sản phẩm sắp hết hàng</span>
                      <span className={styles.activityValue} style={{ color: "#dc2626" }}>
                        {lowStockProducts.filter(p => p.status === "critical").length} sản phẩm
                      </span>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityDot} style={{ background: "#10b981" }} />
                    <div className={styles.activityContent}>
                      <span className={styles.activityLabel}>Đơn nhập hôm nay</span>
                      <span className={styles.activityValue} style={{ color: "#059669" }}>
                        {kpi?.dat_hang_hom_nay ?? 0} đơn
                      </span>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityDot} style={{ background: "#ec4899" }} />
                    <div className={styles.activityContent}>
                      <span className={styles.activityLabel}>Đơn xuất hôm nay</span>
                      <span className={styles.activityValue} style={{ color: "#db2777" }}>
                        {kpi?.nhap_tu_ngay_nay ?? 0} đơn
                      </span>
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
            <h2 className={styles.cardTitle}><WarningOutlined style={{ color: "#f59e0b" }} /> Sản Phẩm Sắp Hết Hàng</h2>
            <button
              className={styles.viewAllBtn}
              onClick={() => navigate("/staff/inventory")}
            >
              Xem tất cả →
            </button>
          </div>
          <LowStockTable data={lowStockProducts} isLoading={isLoading} />
        </div>

      </div>
    </StaffLayout>
  );
}