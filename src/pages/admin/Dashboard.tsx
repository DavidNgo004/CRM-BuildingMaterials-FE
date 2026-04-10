import { useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import type { DashboardPeriod } from '../../types/Admin/dashboard';

// ── Layout
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// ── KPI
import KpiCards from '../../components/dashboard/kpi/KpiCards';

// ── Charts
import RevenueChart from '../../components/dashboard/charts/RevenueChart';
import ProfitChart from '../../components/dashboard/charts/ProfitChart';
import TopProducts from '../../components/dashboard/charts/TopProducts';

// ── Inventory
import InventoryStatus from '../../components/dashboard/inventory/InventoryStatus';

// ── Reports
import TopCustomers from '../../components/dashboard/reports/TopCustomers';
import TopSuppliers from '../../components/dashboard/reports/TopSuppliers';

// ── Alerts
import AiSuggestions from '../../components/dashboard/alerts/AiSuggestions';
import InventoryAlerts from '../../components/dashboard/alerts/InventoryAlerts';

// ── Activities
import RecentActivities from '../../components/dashboard/activities/RecentActivities';

import styles from './Dashboard.module.css';

// ─── Dashboard Page ───────────────────────────────────────────────────────────
// Page duy nhất gọi useDashboard() và phân phối dữ liệu xuống từng widget.
// Layout 3 cột giống ảnh mẫu:
//   Cột trái (4/12):  Revenue chart + Inventory Status
//   Cột giữa (4/12):  Top Products + Profit Chart
//   Cột phải (4/12):  AI Suggestions + Inventory Alerts + Recent Activities

function AdminDashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>('this_month');

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const {
    kpi,
    charts,
    activities,
    alerts,
    miniReports,
    isLoading,
    error,
    refresh,
  } = useDashboard(period);

  return (
    <DashboardLayout
      period={period}
      onPeriodChange={setPeriod}
      userName={user?.name ?? 'Admin'}
      onRefresh={refresh}
      isLoading={isLoading}
      onLogout={handleLogout}
    >
      {/* ── Error banner ── */}
      {error && (
        <div className={styles.errorBanner} role="alert">
          ⚠️ {error}
          <button className={styles.errorClose} onClick={refresh}>Thử lại</button>
        </div>
      )}

      {/* ── ROW 1: KPI Cards ── */}
      <section className={styles.section}>
        <KpiCards kpi={kpi} isLoading={isLoading} />
      </section>

      {/* ── ROW 2: 3-column grid ── */}
      <div className={styles.mainGrid}>

        {/* ═══ LEFT COLUMN ═══ */}
        <div className={styles.col}>
          {/* Revenue Overview Chart */}
          <RevenueChart
            data={charts?.revenue_chart ?? []}
            isLoading={isLoading}
          />

          {/* Inventory Status */}
          <InventoryStatus
            data={charts?.inventory_breakdown ?? null}
            isLoading={isLoading}
          />

          {/* Top Customers */}
          <TopCustomers
            data={miniReports?.top_customers ?? []}
            isLoading={isLoading}
          />
        </div>

        {/* ═══ MIDDLE COLUMN ═══ */}
        <div className={styles.col}>
          {/* Top Selling Products */}
          <TopProducts
            data={charts?.top_products ?? []}
            isLoading={isLoading}
          />

          {/* Profit Trend */}
          <ProfitChart
            data={charts?.profit_chart ?? []}
            isLoading={isLoading}
          />

          {/* Top Suppliers */}
          <TopSuppliers
            data={miniReports?.top_suppliers ?? []}
            isLoading={isLoading}
          />
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div className={styles.col}>
          {/* AI Restock Suggestions */}
          <AiSuggestions
            data={alerts?.suggestions ?? []}
            isLoading={isLoading}
          />

          {/* Inventory Alerts */}
          <InventoryAlerts
            data={alerts?.alerts ?? []}
            isLoading={isLoading}
          />

          {/* Recent Activities */}
          <RecentActivities
            data={activities}
            isLoading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );

}
export default AdminDashboard;