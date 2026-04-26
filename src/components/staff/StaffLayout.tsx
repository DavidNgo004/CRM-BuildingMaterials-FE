import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authContext";
import favicon from "../../assets/favicon.png";
import styles from "./StaffLayout.module.css";
import { HomeOutlined, LogoutOutlined, UserOutlined, ExportOutlined, ImportOutlined, StockOutlined, ProductOutlined, MenuFoldOutlined, MenuUnfoldOutlined, FileTextOutlined } from '@ant-design/icons';

interface StaffLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: <HomeOutlined />, path: "/staff/dashboard" },
  { label: "Quản lý sản phẩm", icon: <ProductOutlined />, path: "/staff/products" },
  { label: "Tồn Kho", icon: <StockOutlined />, path: "/staff/inventory" },
  { label: "Nhập Kho", icon: <ImportOutlined />, path: "/staff/import" },
  { label: "Xuất Kho", icon: <ExportOutlined />, path: "/staff/export" },
  { label: "Báo cáo", icon: <FileTextOutlined />, path: "/staff/reports" },
  { label: "Thông tin cá nhân", icon: <UserOutlined />, path: "/staff/profile" },
];

export default function StaffLayout({ children, onLogout }: StaffLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const path = location.pathname;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar on navigate
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const sidebarClasses = [
    styles.sidebar,
    !isMobile && collapsed ? styles.sidebarCollapsed : '',
    isMobile && mobileOpen ? styles.sidebarMobileOpen : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.root}>
      {/* Mobile overlay */}
      <div
        className={`${styles.sidebarOverlay} ${isMobile && mobileOpen ? styles.sidebarOverlayVisible : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={sidebarClasses}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => navigate("/staff/dashboard")}>
          <div className={styles.logoIcon}>
            <img src={favicon} alt="logo" className={styles.logoImg} />
          </div>
          {(!collapsed || isMobile) && (
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
                title={collapsed && !isMobile ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {(!collapsed || isMobile) && <span className={styles.navLabel}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button className={styles.logoutBtn} onClick={onLogout} title={collapsed && !isMobile ? "Logout" : undefined}>
          <span className={styles.navIcon}><LogoutOutlined /></span>
          {(!collapsed || isMobile) && <span className={styles.navLabel}>Logout</span>}
        </button>
      </aside>

      {/* ── Main Area ── */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.collapseBtn} onClick={handleToggle}>
              {isMobile ? (mobileOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />) :
                (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            </button>
            <span className={styles.pageTitle}>
              {NAV_ITEMS.find(item => path === item.path || path.startsWith(item.path + "/"))?.label ?? "Dashboard"}
            </span>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.userChip}>
              <div className={styles.avatarCircle}>{(user?.name ?? 'W').charAt(0).toUpperCase()}</div>
              <span className={styles.userName}>{user?.name ?? 'Nhân viên kho'}</span>
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
