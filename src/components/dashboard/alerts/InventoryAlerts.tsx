import { useState } from 'react';
import type { InventoryAlert } from '../../../types/Admin/dashboard';
import styles from './InventoryAlerts.module.css';

// ─── InventoryAlerts ──────────────────────────────────────────────────────────
// Danh sách cảnh báo tồn kho: low_stock, overstock, slow_moving.
// Dữ liệu từ DashboardAlertService.alerts[]

interface InventoryAlertsProps {
  data: InventoryAlert[];
  isLoading?: boolean;
}

const LEVEL_CLASS: Record<string, string> = {
  critical: 'critical',
  warning: 'warning',
  info: 'info',
};

const LEVEL_ICON: Record<string, string> = {
  critical: '🚨',
  warning: '⚠️',
  info: '📉',
};

export default function InventoryAlerts({ data, isLoading }: InventoryAlertsProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Lọc chỉ show low_stock + overstock + slow_moving (bỏ ai_forecast vì đã merge vào suggestion)
  const filtered = data.filter((a) => a.type !== 'ai_forecast');
  const displayData = expanded ? filtered : filtered.slice(0, 5);

  return (
    <div className={styles.card}>
      <div className={styles.title}>Cảnh báo tồn kho</div>
      {isLoading ? (
        [1, 2, 3].map((i) => <div key={i} className={styles.skeletonRow} />)
      ) : (
        <div className={styles.list}>
          {displayData.map((alert, idx) => (
            <div
              key={idx}
              className={`${styles.alertRow} ${styles[LEVEL_CLASS[alert.level] ?? 'info']}`}
            >
              <span className={styles.alertIcon}>{LEVEL_ICON[alert.level]}</span>
              <span className={styles.alertText}>{alert.product}{' '}
                {alert.type === 'slow_moving' && alert.drop_pct != null && (
                  <span className={styles.dropPct}>–{alert.drop_pct}%</span>
                )}
                {alert.type === 'low_stock' && <span className={styles.tag}>sắp hết</span>}
                {alert.type === 'overstock' && <span className={styles.tagOverstock}>tồn nhiều</span>}
                {alert.type === 'out_of_stock' && <span className={styles.tagDanger}>hết hàng</span>}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className={styles.empty}>✅ Không có cảnh báo</div>
          )}
          {filtered.length > 5 && (
            <button className={styles.viewAllBtn} onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Thu gọn' : 'Xem tất cả'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
