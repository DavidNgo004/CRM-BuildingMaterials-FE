import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { DashboardPeriod } from "../../types/Admin/dashboard";
import styles from "./DashboardLayout.module.css";
import favicon from "../../assets/favicon.png";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../store/authContext";

const PERIOD_OPTIONS: { label: string; value: DashboardPeriod }[] = [
  { label: "Hôm nay", value: "today" },
  { label: "Tuần này", value: "this_week" },
  { label: "Tháng này", value: "this_month" },
  { label: "Năm này", value: "this_year" },
];

interface DashboardLayoutProps {
  period?: DashboardPeriod;
  onPeriodChange?: (p: DashboardPeriod) => void;
  userName?: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  isLoading?: boolean;
  onLogout?: () => void;
  onProfileClick?: () => void;
}

export default function DashboardLayout({
  period,
  onPeriodChange,
  userName: propUserName,
  children,
  onRefresh,
  isLoading,
  onLogout: propOnLogout,
  onProfileClick,
}: DashboardLayoutProps) {

  const { user, logout } = useAuth();
  const userName = propUserName || user?.name || "Admin";

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleLogout = async () => {
    if (propOnLogout) {
      await propOnLogout();
    } else {
      await logout();
      navigate("/login");
    }
  };


  // click ngoài dropdown → auto close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Link to="/admin/dashboard" className={styles.navLink}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>
                <img src={favicon} alt="logo" className={styles.logoImg} />
              </span>
              <span className={styles.logoText}>CRM VLXD</span>
            </div>
          </Link>

          <nav className={styles.nav}>
            <Link to="/admin/dashboard" className={`${styles.navLink} ${path === '/admin/dashboard' ? styles.navLinkActive : ''}`}>
              Dashboard
            </Link>
            <Link to="/admin/staff-management" className={`${styles.navLink} ${path.includes('/staff-management') ? styles.navLinkActive : ''}`}>
              Tài khoản
            </Link>
            <Link to="/admin/import-management" className={`${styles.navLink} ${path.includes('/import-management') ? styles.navLinkActive : ''}`}>Nhập Kho</Link>
            <Link to="/admin/export-management" className={`${styles.navLink} ${path.includes('/export-management') ? styles.navLinkActive : ''}`}>Xuất Kho</Link>
            <Link to="/admin/product-management" className={`${styles.navLink} ${path.includes('/product-management') ? styles.navLinkActive : ''}`}>Sản phẩm</Link>
            <Link to="/admin/supplier-management" className={`${styles.navLink} ${path.includes('/supplier-management') ? styles.navLinkActive : ''}`}>Nhà cung cấp</Link>
            <Link to="/admin/customer-management" className={`${styles.navLink} ${path.includes('/customer-management') ? styles.navLinkActive : ''}`}>Khách hàng</Link>
            <Link to="/admin/report-management" className={`${styles.navLink} ${path.includes('/report-management') ? styles.navLinkActive : ''}`}>Báo cáo</Link>
            <Link to="/admin/expense-management" className={`${styles.navLink} ${path.includes('/expense-management') ? styles.navLinkActive : ''}`}>Chi phí vận hành</Link>
            <Link to="/admin/activity-log" className={`${styles.navLink} ${path.includes('/activity-log') ? styles.navLinkActive : ''}`}>Lịch sử</Link>
          </nav>
        </div>

        <div className={styles.topbarRight}>
          {/* Refresh */}
          {onRefresh && (
            <button
              className={styles.refreshBtn}
              onClick={onRefresh}
              disabled={isLoading}
            >
              <span className={isLoading ? styles.spinning : ""}>↻</span>
            </button>
          )}

          {/* Avatar user */}
          <div className={styles.avatarWrapper} ref={menuRef}>
            <div
              className={styles.userAvatar}
              onClick={() => setOpenMenu(!openMenu)}
            >
              <div className={styles.avatarCircle}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className={styles.userName}>{userName}</span>
            </div>

            {openMenu && (
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    setOpenMenu(false);
                    if (onProfileClick) onProfileClick();
                    else navigate("/profile");
                  }}
                >
                  <UserOutlined /> Thông tin tài khoản
                </button>

                <div className={styles.dropdownDivider} />

                <button
                  className={styles.dropdownItemLogout}
                  onClick={() => {
                    setOpenMenu(false);
                    handleLogout();
                  }}
                >
                  <LogoutOutlined /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── New Centered Filter Bar ── */}
      {period && onPeriodChange && (
        <div className={styles.filterBar}>
          <div className={styles.filterPill}>
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.filterPillBtn} ${period === opt.value ? styles.filterPillBtnActive : ""}`}
                onClick={() => onPeriodChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}


      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}