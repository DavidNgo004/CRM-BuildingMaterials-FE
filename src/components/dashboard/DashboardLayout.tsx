import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { DashboardPeriod } from "../../types/Admin/dashboard";
import styles from "./DashboardLayout.module.css";
import favicon from "../../assets/favicon.png";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

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
  userName = "Admin",
  children,
  onRefresh,
  isLoading,
  onLogout,
  onProfileClick,
}: DashboardLayoutProps) {

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

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
          <a href="/admin/dashboard" className={styles.navLink}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>
                <img src={favicon} alt="logo" className={styles.logoImg} />
              </span>
              <span className={styles.logoText}>CRM VLXD</span>
            </div>
          </a>

          <nav className={styles.nav}>
            <a href="/admin/dashboard" className={`${styles.navLink} ${path.includes('/dashboard') ? styles.navLinkActive : ''}`}>
              Dashboard
            </a>
            <a href="/admin/staff-management" className={`${styles.navLink} ${path.includes('/staff-management') ? styles.navLinkActive : ''}`}>
              Tài khoản
            </a>
            <a href="#" className={styles.navLink}>Tồn kho</a>
            <a href="/admin/supplier-management" className={`${styles.navLink} ${path.includes('/supplier-management') ? styles.navLinkActive : ''}`}>Nhà cung cấp</a>
            <a href="#" className={styles.navLink}>Khách hàng</a>
            <a href="#" className={styles.navLink}>Báo cáo</a>
          </nav>
        </div>

        <div className={styles.topbarRight}>
          {/* Period filter */}
          {period && onPeriodChange && (
            <div className={styles.periodFilter}>
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`${styles.periodBtn} ${period === opt.value ? styles.periodBtnActive : ""
                    }`}
                  onClick={() => onPeriodChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

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
                    if (onLogout) onLogout();
                  }}
                >
                  <LogoutOutlined /> Đăng xuất
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}