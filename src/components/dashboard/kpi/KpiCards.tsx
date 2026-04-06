import type { DashboardKpi } from '../../../types/dashboard';
import styles from './KpiCards.module.css';

// ─── KpiCards ─────────────────────────────────────────────────────────────────
// 4 KPI cards: Today's Sales, Monthly Revenue, Monthly Profit, Low Stock Alerts.
// Map trực tiếp với response từ DashboardKpiService backend.

interface KpiCardsProps {
  kpi: DashboardKpi | null;
  isLoading?: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

export default function KpiCards({ kpi, isLoading }: KpiCardsProps) {
  if (isLoading || !kpi) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`${styles.card} ${styles.skeleton}`}>
            <div className={styles.skeletonLine} style={{ width: '60%', height: 12, marginBottom: 12 }} />
            <div className={styles.skeletonLine} style={{ width: '80%', height: 28 }} />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'kpi-today-sales',
      label: "Doanh thu hôm nay",
      value: fmt(kpi.revenue_today),
      sub: `${kpi.export_count_today} đơn xuất`,
      icon: '💰',
      color: 'blue',
    },
    {
      id: 'kpi-monthly-revenue',
      label: "Doanh thu tháng",
      value: fmt(kpi.revenue),
      sub: `${kpi.export_count} đơn hoàn thành`,
      icon: '📈',
      color: 'green',
    },
    {
      id: 'kpi-monthly-profit',
      label: "Lợi nhuận ròng",
      value: fmt(kpi.profit),
      sub: `COGS: ${fmt(kpi.cogs)}`,
      icon: '💎',
      color: 'purple',
      negative: kpi.profit < 0,
    },
    {
      id: 'kpi-low-stock',
      label: "Cảnh báo tồn kho",
      value: `${kpi.low_stock_count} Cảnh báo`,
      sub: "Sản phẩm sắp hết hàng",
      icon: '⚠️',
      color: kpi.low_stock_count > 0 ? 'danger' : 'green',
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.id} id={card.id} className={`${styles.card} ${styles[card.color]}`}>
          <div className={styles.cardHeader}>
            <span className={styles.label}>{card.label}</span>
            <span className={styles.icon}>{card.icon}</span>
          </div>
          <div className={`${styles.value} ${card.negative ? styles.negative : ''}`}>
            {card.value}
          </div>
          <div className={styles.sub}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
