import type { TopSupplier } from '../../../types/Admin/dashboard';
import styles from './MiniReports.module.css';

// ─── TopSuppliers ─────────────────────────────────────────────────────────────
// Bảng top 5 nhà cung cấp theo giá trị hàng nhập trong kỳ.
// Dữ liệu từ DashboardReportService.getTopSuppliers()

interface TopSuppliersProps {
  data: TopSupplier[];
  isLoading?: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

export default function TopSuppliers({ data, isLoading }: TopSuppliersProps) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>Top nhà cung cấp</div>
      {isLoading ? (
        [1, 2, 3].map((i) => <div key={i} className={styles.skeletonRow} />)
      ) : (
        <div className={styles.list}>
          {data.map((s, idx) => (
            <div key={s.supplier_id} className={styles.row}>
              <div className={`${styles.rank} ${styles.rankSupplier}`}>{idx + 1}</div>
              <div className={styles.info}>
                <div className={styles.name}>{s.name}</div>
                <div className={styles.sub}>{s.order_count} phiếu nhập • {s.code}</div>
              </div>
              <div className={styles.amount}>{fmt(s.total_value)}</div>
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
