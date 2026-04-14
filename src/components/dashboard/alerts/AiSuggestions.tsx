import type { AiSuggestion } from '../../../types/Admin/dashboard';
import styles from './AiSuggestions.module.css';

// ─── AiSuggestions ────────────────────────────────────────────────────────────
// Hiển thị gợi ý nhập hàng từ AI (DashboardAlertService.suggestions).
// Phân tích dựa trên Linear Regression 14 ngày tới.

interface AiSuggestionsProps {
  data: AiSuggestion[];
  isLoading?: boolean;
}

export default function AiSuggestions({ data, isLoading }: AiSuggestionsProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Gợi ý nhập hàng AI</span>
      </div>
      {isLoading ? (
        [1, 2].map((i) => <div key={i} className={styles.skeletonRow} />)
      ) : (
        <div className={styles.list}>
          {data.slice(0, 5).map((s) => (
            <div key={s.product_id} className={styles.row}>
              <span className={styles.productIcon}>📦</span>
              <div className={styles.info}>
                <div className={styles.name}>{s.product_name}</div>
                <div className={styles.detail}>
                  Đặt thêm{' '}
                  <strong className={styles.qty}>
                    {s.suggested_qty.toLocaleString('vi-VN')} {s.unit}
                  </strong>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className={styles.empty}>✅ Tồn kho đang ổn định</div>
          )}
        </div>
      )}
    </div>
  );
}
