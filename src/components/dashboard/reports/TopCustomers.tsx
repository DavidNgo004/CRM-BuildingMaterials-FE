import type { TopCustomer } from '../../../types/dashboard';
import styles from './MiniReports.module.css';

// ─── TopCustomers ─────────────────────────────────────────────────────────────
// Bảng top 5 khách hàng theo doanh số trong kỳ.
// Dữ liệu từ DashboardReportService.getTopCustomers()

interface TopCustomersProps {
  data: TopCustomer[];
  isLoading?: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

export default function TopCustomers({ data, isLoading }: TopCustomersProps) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>🏢 Top khách hàng</div>
      {isLoading ? (
        [1, 2, 3].map((i) => <div key={i} className={styles.skeletonRow} />)
      ) : (
        <div className={styles.list}>
          {data.map((c, idx) => (
            <div key={c.customer_id} className={styles.row}>
              <div className={styles.rank}>{idx + 1}</div>
              <div className={styles.info}>
                <div className={styles.name}>{c.name}</div>
                <div className={styles.sub}>{c.order_count} đơn • {c.code}</div>
              </div>
              <div className={styles.amount}>{fmt(c.total_purchase)}</div>
            </div>
          ))}
          {data.length === 0 && (
            <div className={styles.empty}>Chưa có dữ liệu</div>
          )}
        </div>
      )}
    </div>
  );
}
