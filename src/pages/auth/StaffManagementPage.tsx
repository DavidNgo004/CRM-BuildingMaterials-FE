import { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Space,
  Alert,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useStaff } from '../../hooks/auth/useStaff';
import StaffTable from '../../components/auth/StaffTable';
import StaffFormModal from '../../components/auth/StaffFormModal';
import type { Staff, CreateStaffRequest, UpdateStaffRequest } from '../../types/auth';
import '../../styles/auth.css';

const { Title, Text } = Typography;

/**
 * StaffManagementPage — Quản lý nhân viên kho.
 * Chỉ accessible bởi admin (guard ở ProtectedRoute).
 */
export default function StaffManagementPage() {
  const { staffs, loading, error, createStaff, updateStaff, deleteStaff } = useStaff();

  const [modalOpen, setModalOpen]         = useState(false);
  const [editingStaff, setEditingStaff]   = useState<Staff | null>(null);
  const [modalLoading, setModalLoading]   = useState(false);
  const [modalError, setModalError]       = useState<string | null>(null);

  const openCreate = () => {
    setEditingStaff(null);
    setModalError(null);
    setModalOpen(true);
  };

  const openEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setModalError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStaff(null);
    setModalError(null);
  };

  const handleSubmit = async (values: CreateStaffRequest | UpdateStaffRequest) => {
    setModalLoading(true);
    setModalError(null);

    let success: boolean;
    if (editingStaff) {
      success = await updateStaff(editingStaff.id, values as UpdateStaffRequest);
    } else {
      success = await createStaff(values as CreateStaffRequest);
    }

    setModalLoading(false);

    if (success) {
      closeModal();
    } else {
      setModalError('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const handleDelete = async (id: number) => {
    await deleteStaff(id);
  };

  return (
    <div className="auth-inner-page">

      {/* ── Header ── */}
      <div className="auth-page-header">
        <Space direction="vertical" size={2}>
          <Title level={4} style={{ margin: 0 }}>
            <TeamOutlined style={{ color: '#6366f1', marginRight: 10 }} />
            Quản lý nhân viên kho
          </Title>
          <Text type="secondary">
            Tạo và quản lý tài khoản nhân viên kho hàng
          </Text>
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Thêm nhân viên
        </Button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <Card style={{ borderRadius: 12, flex: '0 0 auto' }} styles={{ body: { padding: '16px 24px' } }}>
          <Statistic
            title="Tổng nhân viên kho"
            value={staffs.length}
            prefix={<UserAddOutlined style={{ color: '#6366f1' }} />}
            valueStyle={{ fontSize: 28, fontWeight: 700, color: '#6366f1' }}
          />
        </Card>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16, borderRadius: 10 }}
        />
      )}

      {/* ── Table ── */}
      <Card style={{ borderRadius: 16 }}>
        <StaffTable
          staffs={staffs}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* ── Modal ── */}
      <StaffFormModal
        open={modalOpen}
        editingStaff={editingStaff}
        loading={modalLoading}
        error={modalError}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    </div>
  );
}
