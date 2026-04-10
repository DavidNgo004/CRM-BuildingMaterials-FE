import type { InventoryBreakdown } from '../../../types/Admin/dashboard';
import styles from './InventoryStatus.module.css';

// ─── InventoryStatus ──────────────────────────────────────────────────────────
// 3 badge counts: Low Stock (đỏ), Normal (xanh), Overstock (vàng).
// Dữ liệu từ DashboardChartService.inventoryBreakdown()

interface InventoryStatusProps {
  data: InventoryBreakdown | null;
  isLoading?: boolean;
}

export default function InventoryStatus({ data, isLoading }: InventoryStatusProps) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>Trạng thái tồn kho</div>
      <div className={styles.grid}>
        <div className={`${styles.badge} ${styles.danger}`}>
          <div className={styles.number}>
            {isLoading ? '–' : (data?.low_stock ?? 0) + (data?.out_of_stock ?? 0)}
          </div>
          <div className={styles.label}>Thiếu hàng</div>
        </div>
        <div className={`${styles.badge} ${styles.success}`}>
          <div className={styles.number}>
            {isLoading ? '–' : data?.normal ?? 0}
          </div>
          <div className={styles.label}>Bình thường</div>
        </div>
        <div className={`${styles.badge} ${styles.warning}`}>
          <div className={styles.number}>
            {isLoading ? '–' : data?.overstock ?? 0}
          </div>
          <div className={styles.label}>Tồn nhiều</div>
        </div>
      </div>
    </div>
  );
}
