import type { TopProduct } from '../../../types/Admin/dashboard';
import styles from './TopProducts.module.css';

// ─── TopProducts ──────────────────────────────────────────────────────────────
// Top 5 sản phẩm bán chạy dạng horizontal progress bars.
// Dữ liệu từ DashboardChartService.topProducts()

interface TopProductsProps {
  data: TopProduct[];
  isLoading?: boolean;
}

const COLORS = ['#2563eb', '#2563eb', '#16a34a', '#d97706', '#7c3aed'];

export default function TopProducts({ data, isLoading }: TopProductsProps) {
  if (isLoading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.title}> Sản phẩm bán chạy</div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.skeletonRow} />
        ))}
      </div>
    );
  }

  const maxQty = Math.max(...data.map((p) => p.total_qty), 1);

  return (
    <div className={styles.card}>
      <div className={styles.title}> Sản phẩm bán chạy</div>
      <div className={styles.list}>
        {data.map((product, idx) => (
          <div key={product.product_id} className={styles.row}>
            <div className={styles.rowTop}>
              <span className={styles.name}>{product.name}</span>
              <span className={styles.qty}>{product.total_qty.toLocaleString('vi-VN')} {product.unit}</span>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${(product.total_qty / maxQty) * 100}%`,
                  backgroundColor: COLORS[idx % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className={styles.empty}>Chưa có dữ liệu bán hàng</div>
        )}
      </div>
    </div>
  );
}
