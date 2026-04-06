import type { DashboardPeriod } from '../../types/dashboard';
import styles from './DashboardLayout.module.css';
import favicon from '../../assets/favicon.png';
// ─── DashboardLayout ──────────────────────────────────────────────────────────
// Bố cục tổng thể cho trang Dashboard:
// - Topbar với logo, nav links, period filter, user avatar
// - Content area

const PERIOD_OPTIONS: { label: string; value: DashboardPeriod }[] = [
  { label: 'Hôm nay', value: 'today' },
  { label: 'Tuần này', value: 'this_week' },
  { label: 'Tháng này', value: 'this_month' },
  { label: 'Năm này', value: 'this_year' },
];

interface DashboardLayoutProps {
  period: DashboardPeriod;
  onPeriodChange: (p: DashboardPeriod) => void;
  userName?: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function DashboardLayout({
  period,
  onPeriodChange,
  userName = 'Admin',
  children,
  onRefresh,
  isLoading,
}: DashboardLayoutProps) {
  return (
    <div className={styles.root}>
      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <a href="/admin/dashboard" className={`${styles.navLink}`}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}><img src={favicon} alt="logo" className={styles.logoImg}></img></span>
              <span className={styles.logoText}>CRM VLXD</span>
            </div>
          </a>
          <nav className={styles.nav}>
            <a href="/admin/dashboard" className={`${styles.navLink} ${styles.navLinkActive}`}>
              Dashboard
            </a>
            <a href="#" className={styles.navLink}>Tồn kho</a>
            <a href="#" className={styles.navLink}>Nhà cung cấp</a>
            <a href="#" className={styles.navLink}>Khách hàng</a>
            <a href="#" className={styles.navLink}>Báo cáo</a>
          </nav>
        </div>

        <div className={styles.topbarRight}>
          {/* Period filter */}
          <div className={styles.periodFilter}>
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                id={`period-btn-${opt.value}`}
                className={`${styles.periodBtn} ${period === opt.value ? styles.periodBtnActive : ''}`}
                onClick={() => onPeriodChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            id="dashboard-refresh-btn"
            className={styles.refreshBtn}
            onClick={onRefresh}
            disabled={isLoading}
            title="Làm mới dữ liệu"
          >
            <span className={isLoading ? styles.spinning : ''}>↻</span>
          </button>

          {/* User avatar */}
          <div className={styles.userAvatar}>
            <div className={styles.avatarCircle}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className={styles.userName}>{userName}</span>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
