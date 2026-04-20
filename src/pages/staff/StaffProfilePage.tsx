import { useEffect, useState } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import StaffProfileView from "../../components/staff/profile/StaffProfileView";
import { useAuth } from "../../store/authContext";
import { useChangePassword } from "../../hooks/auth/useChangePassword";
import { Modal } from "antd";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import { useNavigate } from "react-router-dom";

export default function StaffProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const changePwd = useChangePassword();

    useEffect(() => {
        document.title = "Thông tin cá nhân - Kho VLXD";
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <StaffLayout onLogout={handleLogout}>
            <div style={{ padding: '24px', backgroundColor: '#f3f4f6', minHeight: 'calc(100vh - 64px)' }}>
                <h2 style={{ fontSize: '24px', color: '#1e1b4b', fontWeight: 700, marginBottom: '24px' }}>Thông Tin Cá Nhân</h2>
                
                {user && (
                    <StaffProfileView 
                        name={user.name} 
                        email={user.email} 
                        onChangePasswordClick={() => setIsModalOpen(true)} 
                    />
                )}

                <Modal
                    title="Đổi mật khẩu"
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        changePwd.reset();
                    }}
                    footer={null}
                    destroyOnClose
                >
                    <ChangePasswordForm
                      loading={changePwd.loading}
                      success={changePwd.success}
                      error={changePwd.error}
                      onSubmit={changePwd.handleChangePassword}
                      onReset={changePwd.reset}
                    />
                </Modal>
            </div>
        </StaffLayout>
    );
}
