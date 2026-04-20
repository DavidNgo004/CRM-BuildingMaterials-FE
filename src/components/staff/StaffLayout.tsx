import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import favicon from "../../assets/favicon.png";
import styles from "./StaffLayout.module.css";
import { HomeOutlined, LogoutOutlined, UserOutlined, ExportOutlined, ImportOutlined, RobotOutlined, StockOutlined, ProductOutlined } from '@ant-design/icons';

interface StaffLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: <HomeOutlined />, path: "/staff/dashboard" },
  { label: "Quản lý sản  phẩm", icon: <ProductOutlined />, path: "/staff/products" },
  { label: "Tồn Kho", icon: <StockOutlined />, path: "/staff/inventory" },
  { label: "Nhập Kho", icon: <ImportOutlined />, path: "/staff/import" },
  { label: "Xuất Kho", icon: <ExportOutlined />, path: "/staff/export" },
  { label: "AI Gợi Ý Nhập Kho", icon: <RobotOutlined />, path: "/staff/ai-suggestions" },
  { label: "Thông tin cá nhân", icon: <UserOutlined />, path: "/staff/profile" },
];

export default function StaffLayout({ children, onLogout }: StaffLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.root}>
      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => navigate("/staff/dashboard")}>
          <div className={styles.logoIcon}>
            <img src={favicon} alt="logo" className={styles.logoImg} />
          </div>
          {!collapsed && (
            <span className={styles.logoText}>Dashboard</span>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = path === item.path || path.startsWith(item.path + "/");
            return (
              <button
                key={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button className={styles.logoutBtn} onClick={onLogout} title={collapsed ? "Logout" : undefined}>
          <span className={styles.navIcon}><LogoutOutlined /></span>
          {!collapsed && <span className={styles.navLabel}>Logout</span>}
        </button>
      </aside>

      {/* ── Main Area ── */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? "▶" : "◀"}
            </button>
            <span className={styles.pageTitle}>
              {NAV_ITEMS.find(item => path === item.path || path.startsWith(item.path + "/"))?.label ?? "Dashboard"}
            </span>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.iconBtn} title="Tìm kiếm">🔍</button>
            <button className={styles.iconBtn} title="Thông báo">🔔</button>
            <div className={styles.userChip}>
              <div className={styles.avatarCircle}>W</div>
              <span className={styles.userName}>Warehouse Staff</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
