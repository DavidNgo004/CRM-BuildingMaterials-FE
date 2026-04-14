import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Spin } from 'antd';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../store/authContext';
import SupplierPage from '../pages/admin/SupplierPage';
import ProductPage from '../pages/admin/ProductPage';
import CustomerPage from '../pages/admin/CustomerPage';
import ImportPage from '../pages/admin/ImportPage';
import ExportPage from '../pages/admin/ExportPage';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────

const Login = lazy(() => import('../pages/Login'));
const ProfilePage = lazy(() => import('../pages/auth/ProfilePage'));
const StaffManagementPage = lazy(() => import('../pages/admin/StaffManagementPage'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const StaffDashboard = lazy(() => import('../pages/staff/StaffDashboard'));

// ─── Loading fallback ─────────────────────────────────────────────────────────

const PageLoader = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Spin size="large" />
  </div>
);

// ─── Smart root redirect ──────────────────────────────────────────────────────
// Đã đăng nhập → về đúng dashboard theo role.
// Chưa đăng nhập → về /login.

function RootRedirect() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? '/admin/dashboard' : '/staff/dashboard'} replace />;
}

// ─── Login guard ──────────────────────────────────────────────────────────────
// Nếu đã đăng nhập mà cố vào /login → redirect về dashboard ngay.

function LoginGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/staff/dashboard'} replace />;
  }
  return <>{children}</>;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

export default function AppRoutes() {

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* Public */}
          <Route
            path="/login"
            element={
              <LoginGuard>
                <Login />
              </LoginGuard>
            }
          />

          {/* Redirect gốc — thông minh theo role */}
          <Route path="/" element={<RootRedirect />} />

          {/* ── Protected: bất kỳ ai đã login ── */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ── Protected: chỉ Admin ── */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/staff-management"
            element={
              <ProtectedRoute role="admin" redirectTo="/admin/dashboard">
                <StaffManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute role="warehouse_staff" redirectTo="/login">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product-management"
            element={
              <ProtectedRoute role="admin" redirectTo="/admin/dashboard">
                <ProductPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/supplier-management"
            element={
              <ProtectedRoute role="admin" redirectTo="/admin/dashboard">
                <SupplierPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/customer-management"
            element={
              <ProtectedRoute role="admin" redirectTo="/admin/dashboard">
                <CustomerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/import-management"
            element={
              <ProtectedRoute role="admin" redirectTo="/admin/dashboard">
                <ImportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/export-management"
            element={
              <ProtectedRoute role="admin" redirectTo="/admin/dashboard">
                <ExportPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}