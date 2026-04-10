import type { Activity } from '../../../types/Admin/dashboard';
import { ImportOutlined, ExportOutlined } from '@ant-design/icons';
import styles from './RecentActivities.module.css';

// ─── RecentActivities ─────────────────────────────────────────────────────────
// Feed hoạt động gần nhất từ inventory_logs.
// Dữ liệu từ DashboardActivityService (type: import | export)

interface RecentActivitiesProps {
  data: Activity[];
  isLoading?: boolean;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  import: <ImportOutlined />,
  export: <ExportOutlined />,
};

const TYPE_COLOR: Record<string, string> = {
  import: 'import',
  export: 'export',
};

function getInitial(name?: string): string {
  return (name ?? '?').charAt(0).toUpperCase();
}

export default function RecentActivities({ data, isLoading }: RecentActivitiesProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Hoạt động gần đây</span>
        <span className={styles.count}>{data.length}</span>
      </div>

      {isLoading ? (
        [1, 2, 3, 4].map((i) => <div key={i} className={styles.skeletonRow} />)
      ) : (
        <div className={styles.feed}>
          {data.slice(0, 8).map((act) => (
            <div key={act.id} className={styles.row}>
              {/* Avatar với initial */}
              <div className={`${styles.avatar} ${styles[TYPE_COLOR[act.type] ?? 'export']}`}>
                {getInitial(act.user)}
              </div>

              <div className={styles.content}>
                <div className={styles.desc}>
                  <strong>{act.user}</strong>{' '}
                  <span className={styles.typeTag}>{TYPE_ICON[act.type]}</span>{' '}
                  {act.type === 'export' ? 'xuất' : 'nhập'}{' '}
                  <strong>{act.quantity} {act.unit}</strong> {act.product}
                </div>
                <div className={styles.time}>{act.time}</div>
              </div>
            </div>
          ))}

          {data.length === 0 && (
            <div className={styles.empty}>Chưa có hoạt động nào</div>
          )}
        </div>
      )}
    </div>
  );
}
